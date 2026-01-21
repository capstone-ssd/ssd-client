export interface PDFContent {
    text: string;
    paragraphs: Array<{ content: string; role?: string; pageNumber: number; yRatio?: number; fontSize?: number }>;
    tables: Array<{ rows: number; cols: number; data: string[][]; pageNumber?: number }>;
    images: Array<{ data: string; width: number; height: number; pageNumber: number }>;
    tablePagesNumbers?: number[];
}

export interface ExtractedTable {
    rows: number;
    cols: number;
    data: string[][];
    pageNumber?: number;
}

export interface TableRegion {
    pageNumber: number;
    top: number; // y축 시작 비율 (0~1)
    bottom: number; // y축 끝 비율 (0~1)
}

export interface AzureExtractionResult {
    tables: ExtractedTable[];
    tableRegions: TableRegion[]; // 필터링을 위한 영역 정보 추가
}
