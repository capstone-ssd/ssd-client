import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// pdf 파싱 과정에 필요한 계산을 Worker에세 할당(라이브러리 내부적으로 Woker 인스턴스 생성)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export { pdfjsLib };
