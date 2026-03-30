import DocumentIntelligence from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';
import type {
  AzureAnalyzeResult,
  AzureInitialResponse,
  AzureOperationResult,
  AzureOptions,
} from '../types/azure-docs-sdk.types';
import type {
  AzureExtractionResult,
  ExtractedTable,
  TableRegion,
} from '../types/extracted-pdf.types';
import { AZURE_EXTRACT_INFO } from '../constants/pdf-extraction.constants';

/**
 * Azure Document Intelligence API를 사용하여 PDF 파일에서 표와 영역 정보를 추출
 * @param file - 분석할 PDF 파일
 * @param options - Azure API 옵션 (페이지 범위 등)
 * @returns 추출된 표와 표 영역 정보
 * @throws Azure 환경 변수 미설정, 분석 실패, 타임아웃 등의 에러
 */
export async function extractPDFWithAzure(
  file: File,
  options?: AzureOptions
): Promise<AzureExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (!AZURE_EXTRACT_INFO.endpoint || !AZURE_EXTRACT_INFO.apiKey)
    throw new Error('Azure 환경 변수가 설정되지 않았습니다');

  const client = DocumentIntelligence(
    AZURE_EXTRACT_INFO.endpoint,
    new AzureKeyCredential(AZURE_EXTRACT_INFO.apiKey)
  );
  const queryParameters: Record<string, unknown> = {};
  if (options?.pages && options.pages.length > 0) {
    queryParameters.pages = formatPageRange(options.pages);
  }

  const initialResponse = await postAnalyzeRequest(client, bytes, queryParameters);
  const operationLocation = initialResponse.headers['operation-location'];
  if (!operationLocation) throw new Error('Operation Location을 찾을 수 없습니다');

  const result = await pollAnalysisResult(operationLocation);
  if (!result?.analyzeResult) throw new Error('분석 결과가 없습니다');

  return parseAzureResult(result.analyzeResult);
}

/**
 * Azure API에 분석 요청을 보내고 429 에러 발생 시 재시도
 * @param client - Azure Document Intelligence 클라이언트
 * @param bytes - PDF 파일 바이트 배열
 * @param queryParameters - 쿼리 파라미터 (페이지 범위 등)
 * @returns 초기 응답 객체
 * @throws 재시도 횟수 초과 또는 예상치 못한 에러
 */
async function postAnalyzeRequest(
  client: ReturnType<typeof DocumentIntelligence>,
  bytes: Uint8Array,
  queryParameters: Record<string, unknown>
) {
  let postAttempts = 0;

  while (postAttempts < AZURE_EXTRACT_INFO.MAX_POST_ATTEMPTS) {
    const response = (await client
      .path('/documentModels/{modelId}:analyze', 'prebuilt-layout')
      .post({
        contentType: 'application/octet-stream',
        body: bytes,
        queryParameters,
      })) as AzureInitialResponse;

    // HTTP status 429 체크
    const is429Status = response.status === '429';

    // Body 내부 error.code 429 체크
    const is429Body = response.body?.error?.code === '429';

    if (is429Status || is429Body) {
      const waitTime = calculateRetryWait(
        response.headers['retry-after'],
        response.body?.error?.message
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      postAttempts++;
      continue;
    }

    if (!response) {
      throw new Error('');
    }

    return response;
  }

  throw new Error('POST 요청 재시도 횟수 초과 (레이트 리밋)');
}

/**
 * 429 에러 발생 시 대기 시간 계산
 * @param retryAfterHeader - Retry-After 헤더 값
 * @param errorMessage - 에러 메시지 (초 단위 추출용)
 * @returns 대기 시간 (밀리초)
 */
function calculateRetryWait(retryAfterHeader: string | undefined, errorMessage?: string): number {
  if (retryAfterHeader) {
    return parseInt(retryAfterHeader) * 1000;
  }

  // 에러 메시지에서 "retry after n seconds" 추출
  if (errorMessage) {
    const match = errorMessage.match(/retry after (\d+) second/i);
    if (match) {
      return parseInt(match[1]) * 1000;
    }
  }

  return AZURE_EXTRACT_INFO.INITIAL_DELAY_MS;
}

/**
 * Azure 분석 결과를 폴링하여 완료될 때까지 대기
 * @param operationLocation - 분석 상태 확인 URL
 * @returns 분석 완료 결과
 * @throws 분석 실패, 타임아웃 등의 에러
 */
async function pollAnalysisResult(operationLocation: string): Promise<AzureOperationResult> {
  let attempts = 0;
  let currentDelay = Number(AZURE_EXTRACT_INFO.INITIAL_DELAY_MS);

  while (attempts < AZURE_EXTRACT_INFO.MAX_POLLING_ATTEMPTS) {
    const res = await fetch(operationLocation, {
      headers: { 'Ocp-Apim-Subscription-Key': AZURE_EXTRACT_INFO.apiKey! },
    });

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      const waitTime = retryAfter
        ? parseInt(retryAfter) * 1000
        : currentDelay * AZURE_EXTRACT_INFO.RATE_LIMIT_MULTIPLIER;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      currentDelay = waitTime;
      attempts++;
      continue;
    }

    const result: AzureOperationResult = await res.json();

    if (result.status === 'succeeded') return result;
    if (result.status === 'failed') {
      throw new Error(`분석 실패: ${result.error?.message || '알 수 없는 오류'}`);
    }

    const serverRetryAfter = res.headers.get('Retry-After');
    const nextDelay = serverRetryAfter ? parseInt(serverRetryAfter) * 1000 : currentDelay;

    await new Promise((resolve) => setTimeout(resolve, nextDelay));
    attempts++;

    if (!serverRetryAfter) {
      currentDelay = Math.min(
        currentDelay * AZURE_EXTRACT_INFO.POLLING_DELAY_MULTIPLIER,
        AZURE_EXTRACT_INFO.MAX_POLLING_DELAY_MS
      );
    }
  }

  throw new Error('분석 시간 초과');
}

/**
 * 페이지 번호 배열을 Azure API 형식의 페이지 범위 문자열로 변환
 * @param pages - 페이지 번호 배열
 * @returns 페이지 범위 문자열 (예: "1-2", "1,3", "2-4,7")
 * @example
 * formatPageRange([1, 2, 3]) // "1-3"
 * formatPageRange([1, 3, 5]) // "1,3,5"
 * formatPageRange([1, 2, 4, 5]) // "1-2,4-5"
 */
function formatPageRange(pages: number[]): string {
  if (pages.length === 0) return '';
  if (pages.length === 1) return pages[0].toString();

  const sortedPages = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sortedPages[0];
  let end = sortedPages[0];

  for (let i = 1; i < sortedPages.length; i++) {
    if (sortedPages[i] === end + 1) {
      end = sortedPages[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = sortedPages[i];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);

  return ranges.join(',');
}

/**
 * Azure 분석 결과를 파싱하여 표와 표 영역 정보를 추출합니다.
 * @param analyzeResult - Azure API 분석 결과
 * @returns 추출된 표와 표 영역 정보
 */
function parseAzureResult(analyzeResult: AzureAnalyzeResult): AzureExtractionResult {
  const pageHeightMap = new Map<number, number>();
  analyzeResult.pages?.forEach((page) => {
    pageHeightMap.set(page.pageNumber, page.height);
  });

  const tables: ExtractedTable[] = parseTableData(analyzeResult);
  const tableRegions: TableRegion[] = parseTableRegions(analyzeResult, pageHeightMap);

  return {
    tables,
    tableRegions,
  };
}

/**
 * Azure 분석 결과에서 표 데이터를 추출합니다.
 * @param analyzeResult - Azure API 분석 결과
 * @returns 표 데이터 배열
 */
function parseTableData(analyzeResult: AzureAnalyzeResult): ExtractedTable[] {
  return (
    analyzeResult.tables?.map((table) => {
      const grid: string[][] = Array(table.rowCount)
        .fill(null)
        .map(() => Array(table.columnCount).fill(''));

      table.cells.forEach((cell) => {
        grid[cell.rowIndex][cell.columnIndex] = cell.content;
      });

      return {
        rows: table.rowCount,
        cols: table.columnCount,
        data: grid,
        pageNumber: table.boundingRegions?.[0]?.pageNumber,
      };
    }) || []
  );
}

/**
 * Azure 분석 결과에서 표 영역 정보를 추출합니다.
 * @param analyzeResult - Azure API 분석 결과
 * @param pageHeightMap - 페이지 번호별 높이 맵
 * @returns 표 영역 정보 배열 (y축 비율 포함)
 */
function parseTableRegions(
  analyzeResult: AzureAnalyzeResult,
  pageHeightMap: Map<number, number>
): TableRegion[] {
  return (
    analyzeResult.tables?.map((table) => {
      const region = table.boundingRegions?.[0];
      const polygon = region?.polygon || [];
      const pageHeight = pageHeightMap.get(region?.pageNumber || 0) || 1;

      const yValues = [polygon[1], polygon[3], polygon[5], polygon[7]];
      return {
        pageNumber: region?.pageNumber || 0,
        top: Math.min(...yValues) / pageHeight,
        bottom: Math.max(...yValues) / pageHeight,
      };
    }) || []
  );
}
