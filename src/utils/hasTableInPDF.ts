import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// pdf 파싱 과정에 필요한 계산을 Worker에세 할당(라이브러리 내부적으로 Woker 인스턴스 생성)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 *
 * @param file File 객체
 * @returns pdf 표준 명세서에서 제시하는 표를 구성하는데 필요한 명령어(`lineTo`, `rectangle`)와 이들을 최적화한 `constructPath` 명령어의 수를 계산하여
 * 20개(최소한의 표 - 2x2를 구성하는데 필요한 constructPath 명령어의 수에서 오차범위를 고려한 값)를 넘으면  true, 넘지 않으면 fals를 반환
 */
export async function hasTableInPDF(file: File): Promise<boolean> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const ops = await page.getOperatorList();

        let lineCount = 0;

        for (let i = 0; i < ops.fnArray.length; i++) {
            const op = ops.fnArray[i];

            if (op === pdfjsLib.OPS.lineTo || op === pdfjsLib.OPS.rectangle || op === pdfjsLib.OPS.constructPath) {
                lineCount++;

                if (lineCount >= 20) {
                    return true;
                }
            }
        }
    }

    return false;
}
