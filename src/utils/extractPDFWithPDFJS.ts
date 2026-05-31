import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { pdfjsLib } from './pdfConfig';
import type { Images, Paragraphs, PDFImage } from '../types/pdfjs.types';
import type { PDFOperatorList, TextContent } from 'pdfjs-dist/types/src/display/api';
import {
  IMAGE_DECODE_DELAY,
  IMAGE_QUALITY,
  NEW_LINE_Y_THRESHOLD,
  SAME_LINE_Y_THRESHOLD,
  TABLE_LINE_THRESHOLD,
} from '../constants/pdf-extraction.constants';
import type { PDFPageProxy } from 'pdfjs-dist';

/**
 * pdfjs-dist를 사용하여 PDF 파일에서 텍스트, 이미지, 표 정보를 추출
 * @param file - 추출할 PDF 파일
 * @returns 추출된 단락, 이미지, 표 페이지 번호 정보
 */
export async function extractPDFWithPDFJS(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const tablePagesNumbers: number[] = [];
  const paragraphs: Paragraphs[] = [];
  const images: Images[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const pageInfo = await pdf.getPage(pageNum);
    const [textContent, operators] = await Promise.all([
      pageInfo.getTextContent(),
      pageInfo.getOperatorList(),
    ]);

    /**
     * 선의 개수로 표가 있는지 검증하고 있다면 배열에 추가
     */
    if (hasTable(operators)) {
      tablePagesNumbers.push(pageNum);
    }

    const viewport = pageInfo.getViewport({ scale: 1.0 });
    const pageHeight = viewport.height; // 페이지의 전체 높이 (pt)

    /**
     * 텍스트 추출
     * 페이지별 텍스트 정보를 가지고 있는 `items`를 순회하여 폰트 크기와 y축 기준 위치 비율로(중복 테스트 제거 용도) 반환
     */
    const textItems = extractTextItems(textContent, pageHeight);
    if (textItems.length > 0) {
      const pageParagraphs = groupIntoParagraphs(textItems, pageNum);
      paragraphs.push(...pageParagraphs);
    }

    /**
     * 이미지 추출
     * 명령어 코드 배열을 순차로 순회하면서 이미지를 그리는 명령어가 등장하면 해당 명령어의 인자에서 이미지 식별자를 `imageNames` 배열에 추가함
     * `imageNames` 배열을 순회하면서 인식할 수 있는 url 형태로 변환
     */
    const imageNames = extractImageNames(operators);
    if (imageNames.length > 0) {
      // pdfjs는 이미지 실행 명령어만 가지고 있기 때문에 실제로 렌더링하려면 Worker에게 이미지 렌더링 트리거하여 실제로 디코딩하도록
      await renderPageForImages(pageInfo, viewport);
      const pageImages = await extractImages(pageInfo, imageNames, pageNum);
      images.push(...pageImages);
    }
  }

  return {
    paragraphs,
    images,
    hasTable: tablePagesNumbers.length > 0,
    tablePagesNumbers,
  };
}

/**
 * 선의 개수로 PDF 페이지에 표가 있는지 판단
 * @param operators - pdfjs-dist의 operator list
 * @returns 표 존재 여부
 */
function hasTable(operators: PDFOperatorList): boolean {
  // 테이블을 그리는데 필요한 선의 수 카운팅하기 위한 변수
  let lineCount = 0;
  for (let i = 0; i < operators.fnArray.length; i++) {
    const operator = operators.fnArray[i];
    if (
      operator === pdfjsLib.OPS.constructPath ||
      operator === pdfjsLib.OPS.lineTo ||
      operator === pdfjsLib.OPS.rectangle
    ) {
      lineCount++;
      if (lineCount >= TABLE_LINE_THRESHOLD) {
        return true;
      }
    }
  }
  return false;
}

/**
 * PDF 페이지에서 텍스트 아이템을 추출하고 y축 비율 계산
 * @param textContent - pdfjs-dist에서 추출한 텍스트 콘텐츠
 * @param pageHeight - 페이지 높이 (pt)
 * @returns 텍스트, 폰트 크기, y축 비율을 포함한 아이템 배열
 */
function extractTextItems(textContent: TextContent, pageHeight: number) {
  return textContent.items
    .filter((item): item is TextItem => 'str' in item)
    .map((item: TextItem) => {
      const yFromTop = pageHeight - item.transform[5];
      const yRatio = yFromTop / pageHeight;
      return {
        text: item.str.trim(),
        fontSize: item.height, // 폰트 크기
        yRatio: yRatio,
      };
    });
}

/**
 * 텍스트 아이템을 yRatio + 폰트 크기 변화 기준으로 단락으로 그룹화
 *
 * 판단 기준:
 * 1. yRatio 차이가 SAME_LINE_Y_THRESHOLD 이내 → 같은 줄로 취급 (폰트 크기 무시)
 * 2. yRatio 차이가 NEW_LINE_Y_THRESHOLD 이상 → 새 단락으로 분리
 * 3. 그 사이(다음 줄이지만 인접)이고 폰트 크기가 다를 때 → 새 단락 분리
 * 4. 그 사이이고 폰트 크기가 같을 때 → 같은 단락으로 이어붙임
 */
function groupIntoParagraphs(
  items: Array<{ text: string; fontSize: number; yRatio: number }>,
  pageNum: number
): Paragraphs[] {
  const paragraphs: Paragraphs[] = [];
  let currentParagraph = '';
  let lastFontSize = items[0].fontSize;
  let lastYRatio = items[0].yRatio;
  let paragraphYRatio = items[0].yRatio;

  const flush = () => {
    if (currentParagraph.trim()) {
      paragraphs.push({
        content: currentParagraph.trim(),
        role: '',
        pageNumber: pageNum,
        yRatio: paragraphYRatio,
        fontSize: lastFontSize,
      });
    }
    currentParagraph = '';
  };

  for (const item of items) {
    if (!item.text) continue;

    const yDiff = Math.abs(item.yRatio - lastYRatio);
    const isSameLine = yDiff <= SAME_LINE_Y_THRESHOLD;
    const isNewParagraph = yDiff >= NEW_LINE_Y_THRESHOLD;
    const fontChanged = item.fontSize !== lastFontSize;

    if (currentParagraph === '') {
      // 첫 아이템
      paragraphYRatio = item.yRatio;
    } else if (isSameLine) {
      // 같은 줄 — 폰트 크기 달라도 이어붙임
    } else if (isNewParagraph || fontChanged) {
      // 줄 간격이 크거나 폰트 크기가 다를 때 -> 새 단락
      flush();
      paragraphYRatio = item.yRatio;
    }
    // 인접한 같은 폰트 -> 이어붙임 (else 분기 없음)

    currentParagraph += item.text + ' ';
    lastFontSize = item.fontSize;
    lastYRatio = item.yRatio;
  }

  flush();

  return paragraphs;
}

/**
 * PDF 연산자 목록에서 이미지 식별자를 추출
 * @param operators - PDF.js의 operator list
 * @returns 이미지 식별자 배열
 */
function extractImageNames(operators: PDFOperatorList): string[] {
  const imageNames: string[] = [];
  for (let i = 0; i < operators.fnArray.length; i++) {
    const operator = operators.fnArray[i];
    if (
      operator === pdfjsLib.OPS.paintImageXObject ||
      operator === pdfjsLib.OPS.paintInlineImageXObject ||
      operator === pdfjsLib.OPS.paintImageMaskXObject
    ) {
      imageNames.push(operators.argsArray[i][0]);
    }
  }
  return imageNames;
}

/**
 * PDF 페이지를 렌더링하여 Worker가 이미지를 디코딩하도록 트리거
 * @param pageInfo - PDF.js의 페이지 정보
 * @param viewport - 페이지 뷰포트 (width와 height 다룸)
 */
async function renderPageForImages(
  pageInfo: PDFPageProxy,
  viewport: ReturnType<PDFPageProxy['getViewport']>
): Promise<void> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await pageInfo.render({
    canvasContext: context!,
    viewport: viewport,
    canvas: canvas,
  }).promise; // 렌더링 완료 대기 (이미지 디코딩도 완료됨)

  await new Promise((resolve) => setTimeout(resolve, IMAGE_DECODE_DELAY));
}

/**
 * 디코딩된 이미지를 추출하여 Blob으로 변환
 * @param pageInfo - PDF.js의 페이지 정보
 * @param imageNames - 이미지 식별자 배열
 * @param pageNum - 페이지 번호
 * @returns 추출된 이미지 배열
 */
async function extractImages(
  pageInfo: PDFPageProxy,
  imageNames: string[],
  pageNum: number
): Promise<Images[]> {
  const images: Images[] = [];

  for (const imageName of imageNames) {
    try {
      const image = pageInfo.objs.get(imageName); // 이미지 식별자(name)로 worker가 디코딩한 이미지 데이터 가져옴
      if (!image) continue;

      const blob = await imageToBlob(image);
      const objectUrl = URL.createObjectURL(blob);

      images.push({
        data: objectUrl, // 마크다운에 들어갈 주소
        file: blob, // 서버 전송 시 사용할 원본 객체
        width: image.width,
        height: image.height,
        pageNumber: pageNum,
      });
    } catch (error) {
      console.warn(`이미지 ${imageName} 추출 실패:`, error);
    }
  }

  return images;
}

/**
 * PDFImage를 JPEG Blob으로 변환
 * @param image - PDF.js가 디코딩한 이미지 데이터
 * @returns JPEG 포맷의 Blob
 * @throws Canvas context 생성 실패 또는 지원하지 않는 이미지 형식
 */
async function imageToBlob(image: PDFImage): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context 생성 실패');

  canvas.width = image.width;
  canvas.height = image.height;

  if (image.bitmap) {
    // jpeg, png를 디코딩한 형태
    ctx.drawImage(image.bitmap, 0, 0);
    // toDataURL 호출하기 위해 `<canvas>` 요소에 그림
  } else {
    // TODO pdf 이미지가 rgb, rgba 형태인 경우를 커버해야할지 고려해보고 추후에 추가 -> Adobe 공식에서는 안 쓴다고 함
    throw new Error('지원하지 않는 이미지 형식');
  }

  return new Promise((resolve, reject) => {
    // JPEG 포맷 최적화 (quality: 0.8)
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Blob 생성 실패'));
      },
      'image/jpeg',
      IMAGE_QUALITY
    );
  });
}
