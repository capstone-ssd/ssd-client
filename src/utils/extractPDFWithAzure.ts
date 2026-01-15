import DocumentIntelligence, { isUnexpected } from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';

interface AzureOptions {
    pages?: number[];
}

interface AzureTableCell {
    rowIndex: number;
    columnIndex: number;
    content: string;
}

interface AzureSpan {
    offset: number;
    length: number;
}

interface AzureParagraph {
    content: string;
    role?: string;
    spans: AzureSpan[];
}

interface AzureTable {
    rowCount: number;
    columnCount: number;
    cells: AzureTableCell[];
    spans: AzureSpan[];
}

interface AzureFigure {
    id: string;
    caption?: {
        content: string;
    };
    boundingRegions: unknown;
}

interface AzureAnalyzeResult {
    content?: string;
    paragraphs?: AzureParagraph[];
    tables?: AzureTable[];
    figures?: AzureFigure[];
}

interface AzureOperationResult {
    status: 'succeeded' | 'failed' | 'running' | 'notStarted';
    analyzeResult?: AzureAnalyzeResult;
    error?: {
        message: string;
    };
}

export interface ExtractedTable {
    rows: number;
    cols: number;
    data: string[][];
}

export interface ExtractedFigure {
    id: string;
    caption?: string;
    boundingRegions: unknown;
}

export interface ExtractedParagraph {
    content: string;
    role?: string;
}

export interface AzureExtractionResult {
    text: string;
    paragraphs: ExtractedParagraph[];
    tables: ExtractedTable[];
    figures: ExtractedFigure[];
}

const endpoint = import.meta.env.VITE_AZURE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_KEY;

export async function extractPDFWithAzure(file: File, options?: AzureOptions): Promise<AzureExtractionResult> {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    if (!endpoint || !apiKey) {
        throw new Error('Azure 환경 변수가 설정되지 않았습니다');
    }

    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(apiKey));

    const queryParameters: Record<string, unknown> = {};
    if (options?.pages && options.pages.length > 0) {
        queryParameters.pages = formatPageRange(options.pages);
    }

    const initialResponse = await client.path('/documentModels/{modelId}:analyze', 'prebuilt-layout').post({
        contentType: 'application/octet-stream',
        body: bytes,
        queryParameters,
    });

    if (isUnexpected(initialResponse)) {
        throw new Error(`분석 시작 실패: ${initialResponse}`);
    }

    // 작업 진행 상황을 확인하는 url
    const operationLocation = initialResponse.headers['operation-location'];
    if (!operationLocation) {
        throw new Error('Operation Location을 찾을 수 없습니다');
    }

    let result: AzureOperationResult | undefined = undefined;
    let attempts = 0;
    const maxAttempts = 60;
    let delay = 2000; // 2초 간격으로 풀링

    while (attempts < maxAttempts) {
        const resultResponse = await fetch(operationLocation, {
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
            },
        });

        result = await resultResponse.json();

        if (result?.status === 'succeeded') {
            break;
        } else if (result?.status === 'failed') {
            throw new Error(`분석 실패: ${result.error?.message || '알 수 없는 오류'}`);
        }

        const retryAfter = resultResponse.headers.get('Retry-After');
        if (retryAfter) {
            delay = parseInt(retryAfter) * 1000;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));

        attempts++;
    }

    if (attempts >= maxAttempts) throw new Error('분석 시간 초과');

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
    // 모든 테이블이 차지하는 영역(범위)을 수집
    const tableSpans = analyzeResult.tables?.flatMap((table) => table.spans || []) || [];

    // 단락(Paragraphs) 중에서 테이블 영역과 겹치는 것은 제외
    const paragraphs: ExtractedParagraph[] =
        analyzeResult.paragraphs
            ?.filter((para) => {
                // 단락의 spans가 어떤 테이블의 영역 안에라도 포함되는지 확인
                const isInsideTable = tableSpans.some(
                    (tableSpan) =>
                        para.spans &&
                        para.spans.some(
                            (pSpan) =>
                                pSpan.offset >= tableSpan.offset &&
                                pSpan.offset + pSpan.length <= tableSpan.offset + tableSpan.length
                        )
                );
                return !isInsideTable; // 테이블 안에 없는 것만 유지
            })
            .map((p) => ({
                content: p.content,
                role: p.role,
            })) || [];

    // 필터링된 단락들만 합쳐서 text를 재구
    const text = paragraphs.map((p) => p.content).join('\n\n');

    const tables: ExtractedTable[] =
        analyzeResult.tables?.map((table) => {
            const grid: string[][] = Array(table.rowCount)
                .fill(null)
                .map(() => Array(table.columnCount).fill(''));

            for (const cell of table.cells) {
                grid[cell.rowIndex][cell.columnIndex] = cell.content;
            }

            return {
                rows: table.rowCount,
                cols: table.columnCount,
                data: grid,
            };
        }) || [];

    const figures: ExtractedFigure[] =
        analyzeResult.figures?.map((figure) => ({
            id: figure.id,
            caption: figure.caption?.content,
            boundingRegions: figure.boundingRegions,
        })) || [];

    return { text, paragraphs, tables, figures };
}
