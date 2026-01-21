export interface AzureOptions {
    pages?: number[];
}

interface AzureSpan {
    offset: number;
    length: number;
}

interface AzurePage {
    pageNumber: number;
    height: number;
    width: number;
    unit: 'pixel' | 'inch';
}

interface AzureParagraph {
    content: string;
    role?: string;
    spans?: AzureSpan[];
    boundingRegions?: Array<{
        pageNumber: number;
        polygon: number[];
    }>;
}

interface AzureFigure {
    id: string;
    caption?: {
        content: string;
    };
    boundingRegions: unknown;
    spans?: AzureSpan[];
}

export interface AzureAnalyzeResult {
    content?: string;
    pages?: AzurePage[]; // 페이지 크기 정보가 담긴 배열
    paragraphs?: AzureParagraph[];
    tables?: AzureTable[];
    figures?: AzureFigure[];
}

export interface AzureOperationResult {
    status: 'succeeded' | 'failed' | 'running' | 'notStarted';
    analyzeResult?: AzureAnalyzeResult;
    error?: {
        message: string;
    };
}

interface AzureTableCell {
    rowIndex: number;
    columnIndex: number;
    content: string;
}

interface AzureTable {
    rowCount: number;
    columnCount: number;
    cells: AzureTableCell[];
    spans: AzureSpan[];
    boundingRegions?: Array<{ pageNumber: number; polygon: number[] }>;
}

export interface AzureInitialResponse {
    status: string;
    headers: {
        'operation-location'?: string;
        'retry-after'?: string;
        [key: string]: string | undefined;
    };
    body?: {
        error?: {
            code?: string;
            message?: string;
        };
        [key: string]: unknown;
    };
}
