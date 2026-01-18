import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { pdfjsLib } from './pdfConfig';
import { TextLevelDetector, type MarkdownRole } from './TextLevelDetector';

interface PDFImage {
    width: number;
    height: number;
    bitmap?: ImageBitmap;
    data?: Uint8Array | Uint8ClampedArray;
}

interface Paragraphs {
    content: string;
    role?: string;
    pageNumber: number;
}

interface Images {
    data: string;
    width: number;
    height: number;
    pageNumber: number;
}

export async function extractPDFWithPDFJS(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const tablePagesNumbers: number[] = [];
    let fullText = '';
    const paragraphs: Paragraphs[] = [];
    const images: Images[] = [];

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
            .filter((item): item is TextItem => 'str' in item) // str 속성들만
            .map((item) => ({
                text: item.str.trim(),
                fontSize: item.height,
            }));

        if (items.length === 0) continue;

        const detector = new TextLevelDetector(items);

        let currentParagraph = '';
        let lastRole: MarkdownRole = ''; // 이전 아이템의 role 저장

        for (const item of items) {
            if (!item.text) continue;

            const role = detector.getRole(item.fontSize);
            fullText += item.text + ' ';

            // Role이 바뀌거나 새로운 단락이 시작되어야 하는 경우
            if (role !== lastRole && currentParagraph !== '') {
                paragraphs.push({
                    content: currentParagraph.trim(),
                    role: lastRole,
                    pageNumber: pageNum,
                });
                currentParagraph = '';
            }

            currentParagraph += item.text + ' ';
            lastRole = role; // 현재 role을 저장하여 다음 아이템과 비교
        }

        if (currentParagraph) {
            paragraphs.push({
                content: currentParagraph.trim(),
                role: lastRole,
                pageNumber: pageNum,
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

        // pdfjs는 이미지 실행 명령어만 가지고 있기 때문에 실제로 렌더링하려면 Worker에게 이미지 렌더링 트리거하여 실제로 디코딩하도록
        const viewport = pageInfo.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pageInfo.render({
            canvasContext: context!,
            viewport: viewport, // width와 height 다룸
            canvas: canvas,
        }).promise; // 렌더링 완료 대기 (이미지 디코딩도 완료됨)

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
