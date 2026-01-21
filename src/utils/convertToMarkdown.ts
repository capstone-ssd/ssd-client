import type { PDFContent } from '../types/extracted-pdf.types';

/**
 * PDF 추출 결과를 Markdown 형식으로 변환
 * @param content - PDF 추출 결과 (단락, 표, 이미지 포함)
 * @returns Markdown 형식의 문자열
 */
export function convertToMarkdown(content: PDFContent): string {
    const pageMap = new Map<
        number,
        {
            paragraphs: typeof content.paragraphs;
            tables: typeof content.tables;
            images: typeof content.images;
        }
    >();

    const allPageNumbers = new Set<number>();

    // 페이지 번호 수집
    content.paragraphs.forEach((paragraph) => {
        if (paragraph.pageNumber !== undefined) {
            allPageNumbers.add(paragraph.pageNumber);
        }
    });

    content.tables.forEach((table) => {
        if (table.pageNumber !== undefined) {
            allPageNumbers.add(table.pageNumber);
        }
    });

    content.images.forEach((image) => {
        allPageNumbers.add(image.pageNumber);
    });

    // pageMap 초기화
    allPageNumbers.forEach((pageNumber) => {
        pageMap.set(pageNumber, { paragraphs: [], tables: [], images: [] });
    });

    // 요소 배치
    content.paragraphs.forEach((para) => {
        if (para.pageNumber !== undefined) {
            pageMap.get(para.pageNumber)?.paragraphs.push(para);
        }
    });

    content.tables.forEach((table) => {
        if (table.pageNumber !== undefined) {
            pageMap.get(table.pageNumber)?.tables.push(table);
        }
    });

    content.images.forEach((image) => {
        pageMap.get(image.pageNumber)?.images.push(image);
    });

    const sections: string[] = [];
    const sortedPages = Array.from(allPageNumbers).sort((a, b) => a - b);

    // 페이지별로 순회하며 Markdown 생성
    sortedPages.forEach((pageNumber) => {
        const pageContent = pageMap.get(pageNumber);
        if (!pageContent) return;

        // 단락
        if (pageContent.paragraphs.length > 0) {
            const textSection = pageContent.paragraphs
                .map((para) => {
                    if (para.role && para.role !== '') {
                        return `${para.role} ${para.content}`;
                    }
                    return para.content;
                })
                .join('\n\n');
            sections.push(textSection);
        }

        // 표
        if (pageContent.tables.length > 0) {
            pageContent.tables.forEach((table, index) => {
                sections.push(`\n**표 ${index + 1}**\n`);
                sections.push(tableToMarkdown(table));
            });
        }

        // 이미지
        if (pageContent.images.length > 0) {
            pageContent.images.forEach((image, index) => {
                sections.push(`\n![이미지 ${index + 1}](${image.data})\n`);
            });
        }
    });

    return sections.join('\n\n');
}

/**
 * 표 데이터를 Markdown 표 형식으로 변환
 * 모든 행을 동일하게 처리하며, 첫 행 다음에 구분선을 추가
 * @param table - 표 데이터 (행, 열, 데이터 배열)
 * @returns Markdown 형식의 표 문자열
 */
function tableToMarkdown(table: { rows: number; cols: number; data: string[][] }): string {
    if (table.rows === 0 || table.cols === 0) return '';

    const lines: string[] = [];

    // 모든 행을 동일하게 처리
    for (let i = 0; i < table.rows; i++) {
        const row = table.data[i].map((cell) => cell || '-').join(' | ');
        lines.push(`| ${row} |`);

        // 첫 행 다음에 구분선 추가 (Markdown 표 규칙)
        if (i === 0) {
            const separator = Array(table.cols).fill('---').join(' | ');
            lines.push(`| ${separator} |`);
        }
    }

    return lines.join('\n');
}
