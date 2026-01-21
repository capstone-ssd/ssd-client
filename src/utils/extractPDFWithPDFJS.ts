import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { pdfjsLib } from './pdfConfig';
import type { Images, Paragraphs, PDFImage } from '../types/pdfjs.types';

export async function extractPDFWithPDFJS(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const tablePagesNumbers: number[] = [];
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

        const viewport = pageInfo.getViewport({ scale: 1.0 });
        const pageHeight = viewport.height; // 페이지의 전체 높이 (pt)

        /**
         * 텍스트 추출
         * 페이지별 텍스트 정보를 가지고 있는 `items`를 순회하여 폰트 크기와 y축 기준 위치 비율로(중복 테스트 제거 용도) 반환
         */
        const items = textContent.items
            .filter((item): item is TextItem => 'str' in item)
            .map((item) => {
                const yFromTop = pageHeight - item.transform[5];
                const yRatio = yFromTop / pageHeight;
                return {
                    text: item.str.trim(),
                    fontSize: item.height, // 폰트 크기
                    yRatio: yRatio,
                };
            });

        if (items.length === 0) continue;

        let currentParagraph = '';
        let lastFontSize = items[0].fontSize; // 이전 폰트 크기 추적 용도
        let paragraphYRatio = items[0].yRatio;
        for (const item of items) {
            if (!item.text) continue;

            // 폰트 크기가 변하거나(제목/본문 구분) 줄바꿈 등으로 단락이 나뉠 때
            if (item.fontSize !== lastFontSize && currentParagraph !== '') {
                paragraphs.push({
                    content: currentParagraph.trim(),
                    role: '', // Compound에서 한꺼번에 결정할 것이므로 비워둠
                    pageNumber: pageNum,
                    yRatio: paragraphYRatio,
                    fontSize: lastFontSize, // 이 단락의 폰트 크기 저장
                });
                currentParagraph = '';
                paragraphYRatio = item.yRatio;
            }

            currentParagraph += item.text + ' ';
            lastFontSize = item.fontSize;
        }

        if (currentParagraph) {
            paragraphs.push({
                content: currentParagraph.trim(),
                role: '',
                pageNumber: pageNum,
                yRatio: paragraphYRatio,
                fontSize: lastFontSize,
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
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pageInfo.render({
            canvasContext: context!,
            viewport: viewport, // width와 height 다룸
            canvas: canvas,
        }).promise; // 렌더링 완료 대기 (이미지 디코딩도 완료됨)
        await new Promise((resolve) => setTimeout(resolve, 100));
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
    }

    return {
        paragraphs,
        images,
        hasTable: tablePagesNumbers.length > 0,
        tablePagesNumbers,
    };
}

async function imageToBlob(image: PDFImage): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context 생성 실패');

    canvas.width = image.width;
    canvas.height = image.height;

    if (image.bitmap) {
        ctx.drawImage(image.bitmap, 0, 0);
    } else {
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
            0.8
        );
    });
}
