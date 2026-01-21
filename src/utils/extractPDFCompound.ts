import { TextLevelDetector } from './TextLevelDetector';
import { extractPDFWithAzure } from './extractPDFWithAzure';
import { extractPDFWithPDFJS } from './extractPDFWithPDFJS';
import type { AzureExtractionResult, ExtractedTable, PDFContent, TableRegion } from '../types/extracted-pdf.types';

export async function extractPDFCompound(file: File): Promise<PDFContent> {
    const pdfjsResult = await extractPDFWithPDFJS(file);

    let finalParagraphs = pdfjsResult.paragraphs;
    let tables: ExtractedTable[] = [];
    let tableRegions: TableRegion[] = [];

    if (pdfjsResult.hasTable) {
        try {
            const azureResults: AzureExtractionResult[] = [];
            const tablePages = pdfjsResult.tablePagesNumbers || [];

            for (let i = 0; i < tablePages.length; i += 2) {
                const chunk = tablePages.slice(i, i + 2);
                const result = await extractPDFWithAzure(file, { pages: chunk });
                azureResults.push(result);
            }

            const mergedAzure = mergeAzureResults(azureResults);
            tables = mergedAzure.tables;
            tableRegions = mergedAzure.tableRegions;

            // 표 영역 필터링(표 내부 텍스트 제거)
            finalParagraphs = finalParagraphs.filter((para) => {
                const regionsInPage = tableRegions.filter((r) => r.pageNumber === para.pageNumber);
                const isInsideTable = regionsInPage.some((region) => {
                    return para.yRatio! >= region.top - 0.01 && para.yRatio! <= region.bottom + 0.01;
                });
                return !isInsideTable;
            });
        } catch (error) {
            console.error('Azure 분석 실패', error);
        }
    }

    // 전체 문서 기준 역할 부여
    const detector = new TextLevelDetector(
        finalParagraphs.map((p) => ({
            text: p.content,
            fontSize: p.fontSize || 0,
        }))
    );

    finalParagraphs = finalParagraphs.map((para) => ({
        ...para,
        role: detector.getRole(para.fontSize || 0),
    }));

    return {
        text: finalParagraphs.map((p) => p.content).join('\n\n'),
        paragraphs: finalParagraphs,
        tables,
        images: pdfjsResult.images,
        tablePagesNumbers: pdfjsResult.tablePagesNumbers,
    };
}

function mergeAzureResults(results: AzureExtractionResult[]): AzureExtractionResult {
    return {
        // 모든 결과에서 table 관련 배열을 하나로 합침
        tables: results.flatMap((r) => r.tables || []),
        tableRegions: results.flatMap((r) => r.tableRegions || []),
    };
}
