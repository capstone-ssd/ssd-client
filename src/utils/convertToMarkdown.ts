import type { PDFContent } from '../types/extracted-pdf.types';

export function convertToMarkdown(content: PDFContent): string {
    const pageMap = new Map<
        number,
        {
            paragraphs: typeof content.paragraphs;
            tables: typeof content.tables;
            images: typeof content.images;
        }
    >();

    // 몇 페이지 있는지 기록
    const allPageNumbers = new Set<number>();

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
            pageContent.tables.forEach((table) => {
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

function tableToMarkdown(table: { rows: number; cols: number; data: string[][] }): string {
    if (table.rows === 0 || table.cols === 0) return '';

    const lines: string[] = [];

    // 헤더 행
    const headerRow = table.data[0].map((cell) => cell || ' ').join(' | ');
    lines.push(`| ${headerRow} |`);

    // 구분선
    const separator = Array(table.cols).fill('---').join(' | ');
    lines.push(`| ${separator} |`);

    // 데이터 행
    for (let i = 1; i < table.rows; i++) {
        const dataRow = table.data[i].map((cell) => cell || ' ').join(' | ');
        lines.push(`| ${dataRow} |`);
    }

    return lines.join('\n');
}
