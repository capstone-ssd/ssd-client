import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { pdfjsLib } from './pdfConfig';
import { TextLevelDetector } from './TextLevelDetector';

interface PDFImage {
    width: number;
    height: number;
    bitmap?: ImageBitmap;
    data?: Uint8Array | Uint8ClampedArray;
}

export async function extractPDFWithPDFJS(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const tablePagesNumbers: number[] = [];
    let fullText = '';
    const paragraphs: Array<{ content: string; role?: string }> = [];
    const images: Array<{ data: string; width: number; height: number; pageNumber: number }> = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const pageInfo = await pdf.getPage(pageNum);
        const [textContent, operators] = await Promise.all([pageInfo.getTextContent(), pageInfo.getOperatorList()]);

        /**
         * 선의 개수로 표가 있는지 검증하고 있다면 배열에 추가
         */
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
            }
            if (lineCount >= 25) {
                tablePagesNumbers.push(pageNum);
                break;
            }
        }

        /**
         * 텍스트 추출
         * 페이지별 텍스트 정보를 가지고 있는 `items`를 TextLevelDetector에게 전달하여 텍스트 role 결정
         */
        const items = textContent.items
            .filter((item): item is TextItem => 'str' in item)
            .map((item) => ({
                text: item.str.trim(),
                fontSize: item.height,
            }));

        if (items.length === 0) continue;

        const detector = new TextLevelDetector(items);

        let currentParagraph = '';
        let currentRole: '#' | '##' | '###' | '' = '';

        for (const item of items) {
            if (!item.text) continue;

            // detector가 폰트 크기의 빈도별로 알아서 할당해줌
            const role = detector.getRole(item.fontSize);

            fullText += item.text + ' '; //띄어쓰기 처리

            if (role !== '') {
                // 제목
                if (currentParagraph) {
                    paragraphs.push({
                        content: currentParagraph.trim(),
                        role: currentRole,
                    });
                    currentParagraph = '';
                }
                paragraphs.push({ content: item.text, role });
                currentRole = '';
            } else {
                // 본문
                currentParagraph += item.text + ' ';
                currentRole = role;
            }
        }

        if (currentParagraph) {
            paragraphs.push({
                content: currentParagraph.trim(),
                role: currentRole,
            });
        }

        /**
         * 이미지 추출
         * 명령어 코드 배열을 순차로 순회하면서 이미지를 그리는 명령어가 등장하면 해당 명령어의 인자에서 이미지 식별자를 `imageNames` 배열에 추가함
         * `imageNames` 배열을 순회하면서 인식할 수 있는 url 형태로 변환
         */
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

        for (const imageName of imageNames) {
            try {
                const image = pageInfo.objs.get(imageName); // 이미지 식별자(name)로 worker가 디코딩한 이미지 데이터 가져옴
                if (!image) continue;

                const base64 = await imageToBase64(image);
                images.push({
                    data: base64,
                    width: image.width,
                    height: image.height,
                    pageNumber: pageNum,
                });
            } catch (error) {
                console.warn(`이미지 ${imageName} 추출 실패:`, error);
            }
        }
    }

    return {
        text: fullText.trim(),
        paragraphs,
        images,
        hasTable: tablePagesNumbers.length > 0,
        tablePagesNumbers,
    };
}

async function imageToBase64(image: PDFImage): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context 생성 실패');

    canvas.width = image.width;
    canvas.height = image.height;

    if (image.bitmap) {
        // jpeg, png를 디코딩한 형태
        ctx.drawImage(image.bitmap, 0, 0);
        // toDataURL 호출하기 위해 `<canvas>` 요소에 그림
    } else if (image.data) {
        // TODO pdf 이미지가 rgb, rgba 형태인 경우를 커버해야할지 고려해보고 추후에 추가 -> Adobe 공식에서는 안 쓴다고 함
        throw new Error('RGB, RGBA 이미지 형식 미지원');
    } else {
        throw new Error('이미지 데이터 형식을 알 수 없음');
    }

    return canvas.toDataURL('image/png');
}
