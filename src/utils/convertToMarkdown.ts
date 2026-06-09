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

  type PageElement =
    | { kind: 'paragraph'; yRatio: number; data: (typeof content.paragraphs)[0] }
    | { kind: 'table'; yRatio: number; data: (typeof content.tables)[0] }
    | { kind: 'image'; yRatio: number; data: (typeof content.images)[0] };

  const sections: string[] = [];
  const sortedPages = Array.from(allPageNumbers).sort((a, b) => a - b);

  let tableNum = 0;
  let imageNum = 0;

  // 페이지별로 순회하며 yRatio 기준 정렬 후 Markdown 생성
  sortedPages.forEach((pageNumber) => {
    const pageContent = pageMap.get(pageNumber);
    if (!pageContent) return;

    const elements: PageElement[] = [
      ...pageContent.paragraphs.map((p) => ({
        kind: 'paragraph' as const,
        yRatio: p.yRatio ?? 0,
        data: p,
      })),
      ...pageContent.tables.map((t) => ({
        kind: 'table' as const,
        yRatio: t.yRatio ?? 0,
        data: t,
      })),
      ...pageContent.images.map((img) => ({
        kind: 'image' as const,
        yRatio: img.yRatio,
        data: img,
      })),
    ];

    elements.sort((a, b) => a.yRatio - b.yRatio);

    elements.forEach((el) => {
      if (el.kind === 'paragraph') {
        const para = el.data;
        if (para.role && para.role !== '') {
          sections.push(`${para.role} ${para.content}`);
        } else {
          sections.push(para.content);
        }
      } else if (el.kind === 'table') {
        tableNum++;
        sections.push(`\n**표 ${tableNum}**\n`);
        sections.push(tableToMarkdown(el.data));
      } else if (el.kind === 'image') {
        imageNum++;
        sections.push(`\n![이미지 ${imageNum}](${el.data.data})\n`);
      }
    });
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
