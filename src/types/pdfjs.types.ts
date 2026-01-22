export interface PDFImage {
    width: number;
    height: number;
    bitmap?: ImageBitmap;
    data?: Uint8Array | Uint8ClampedArray;
}

export interface Paragraphs {
    content: string;
    role?: string;
    pageNumber: number;
    yRatio: number;
    fontSize: number; // 전체 문서 분석을 위해 추가
}

export interface Images {
    data: string; // 브라우저 표시용 Blob URL
    file: Blob; // 서버 전송용 실제 이진 데이터
    width: number;
    height: number;
    pageNumber: number;
}
