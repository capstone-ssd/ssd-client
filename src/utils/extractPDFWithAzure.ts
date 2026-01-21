import DocumentIntelligence from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';
import type {
    AzureAnalyzeResult,
    AzureInitialResponse,
    AzureOperationResult,
    AzureOptions,
} from '../types/azure-docs-sdk.types';
import type { AzureExtractionResult, ExtractedTable, TableRegion } from '../types/extracted-pdf.types';

const endpoint = import.meta.env.VITE_AZURE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_KEY;

export async function extractPDFWithAzure(file: File, options?: AzureOptions): Promise<AzureExtractionResult> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (!endpoint || !apiKey) throw new Error('Azure 환경 변수가 설정되지 않았습니다');

    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(apiKey));
    const queryParameters: Record<string, unknown> = {};
    if (options?.pages && options.pages.length > 0) {
        queryParameters.pages = formatPageRange(options.pages);
    }

    let initialResponse: AzureInitialResponse | undefined;
    let postAttempts = 0;
    const maxPostAttempts = 10;

    while (postAttempts < maxPostAttempts) {
        initialResponse = (await client.path('/documentModels/{modelId}:analyze', 'prebuilt-layout').post({
            contentType: 'application/octet-stream',
            body: bytes,
            queryParameters,
        })) as AzureInitialResponse;

        // HTTP status 429 체크
        const is429Status = initialResponse.status === '429';

        // Body 내부 error.code 429 체크
        const is429Body = initialResponse.body?.error?.code === '429';

        if (is429Status || is429Body) {
            const retryAfter = initialResponse.headers['retry-after'];

            // 에러 메시지 "retry after n seconds"에서 추출
            let messageRetrySeconds = 0;
            if (is429Body && initialResponse.body?.error?.message) {
                const match = initialResponse.body.error.message.match(/retry after (\d+) second/i);
                if (match) {
                    messageRetrySeconds = parseInt(match[1]);
                }
            }

            const waitTime = retryAfter
                ? parseInt(retryAfter) * 1000
                : messageRetrySeconds > 0
                ? messageRetrySeconds * 1000
                : 2000;

            await new Promise((resolve) => setTimeout(resolve, waitTime));
            postAttempts++;
            continue;
        }

        break;
    }

    if (!initialResponse) {
        throw new Error(`분석 시작 실패: ${initialResponse}`);
    }

    const operationLocation = initialResponse.headers['operation-location'];
    if (!operationLocation) throw new Error('Operation Location을 찾을 수 없습니다');

    let result: AzureOperationResult | undefined;
    let attempts = 0;
    const maxAttempts = 60;
    let currentDelay = 2000;

    while (attempts < maxAttempts) {
        const res = await fetch(operationLocation, {
            headers: { 'Ocp-Apim-Subscription-Key': apiKey },
        });

        if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After');
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : currentDelay * 2;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            currentDelay = waitTime;
            attempts++;
            continue;
        }

        result = await res.json();
        if (result?.status === 'succeeded') break;
        if (result?.status === 'failed') throw new Error('분석 실패');

        const serverRetryAfter = res.headers.get('Retry-After');
        const nextDelay = serverRetryAfter ? parseInt(serverRetryAfter) * 1000 : currentDelay;

        await new Promise((resolve) => setTimeout(resolve, nextDelay));
        attempts++;

        if (!serverRetryAfter) {
            currentDelay = Math.min(currentDelay * 1.5, 10000);
        }
    }

    if (!result?.analyzeResult) throw new Error('분석 결과가 없습니다');
    return parseAzureResult(result.analyzeResult);
}

/**
 *
 * @param pages table이 있는 페이지들의 배열
 * @returns Azure API가 받는 형식으로 포매팅 ex)1,3 / 2,4 / 1-2 / ...
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

function parseAzureResult(analyzeResult: AzureAnalyzeResult): AzureExtractionResult {
    const pageHeightMap = new Map<number, number>();
    analyzeResult.pages?.forEach((page) => {
        pageHeightMap.set(page.pageNumber, page.height);
    });

    const tables: ExtractedTable[] =
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
        }) || [];

    const tableRegions: TableRegion[] =
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
        }) || [];

    return {
        tables,
        tableRegions,
    };
}
