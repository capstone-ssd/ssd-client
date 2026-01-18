import type { AzureExtractionResult } from './extractPDFWithAzure';
import { extractPDFWithAzure } from './extractPDFWithAzure';
import { extractPDFWithPDFJS } from './extractPDFWithPDFJS';

export interface PDFContent {
    text: string;
    paragraphs: Array<{ content: string; role?: string; pageNumber?: number }>;
    tables: Array<{ rows: number; cols: number; data: string[][]; pageNumber?: number }>;
    images: Array<{ data: string; width: number; height: number; pageNumber: number }>;
    figures: Array<{ id: string; caption?: string; boundingRegions: unknown }>;
    extractionMethod: 'pdfjs-only' | 'azure+pdfjs';
    tablePagesNumbers?: number[];
}

export async function extractPDFCompound(file: File): Promise<PDFContent> {
    const pdfjsResult = await extractPDFWithPDFJS(file);

    if (pdfjsResult.hasTable) {
        const azureResults: AzureExtractionResult[] = [];
        const tablePages = pdfjsResult.tablePagesNumbers;

        for (let i = 0; i < tablePages.length; i += 2) {
            const chunk = tablePages.slice(i, i + 2);

            const result = await extractPDFWithAzure(file, { pages: chunk });
            azureResults.push(result);
        }

        const mergedAzureResult = mergeAzureResults(azureResults);
        const tablePagesSet = new Set(tablePages);
        const nonTableParagraphs = pdfjsResult.paragraphs.filter(
            (paragraph) => !tablePagesSet.has(paragraph.pageNumber)
        );

        const allParagraphs = [...mergedAzureResult.paragraphs, ...nonTableParagraphs].sort(
            (a, b) => (a.pageNumber || 0) - (b.pageNumber || 0)
        );

        // text는 paragraphs로부터 재구성 (또는 그냥 빈 문자열)
        const finalText = allParagraphs.map((p) => p.content).join('\n\n');

        return {
            text: finalText,
            paragraphs: allParagraphs,
            tables: mergedAzureResult.tables,
            images: pdfjsResult.images,
            figures: mergedAzureResult.figures,
            extractionMethod: 'azure+pdfjs',
            tablePagesNumbers: tablePages,
        };
    }

    return {
        text: pdfjsResult.text,
        paragraphs: pdfjsResult.paragraphs,
        tables: [],
        images: pdfjsResult.images,
        figures: [],
        extractionMethod: 'pdfjs-only',
        tablePagesNumbers: [],
    };
}

function mergeAzureResults(results: AzureExtractionResult[]): AzureExtractionResult {
    return {
        text: results.map((r) => r.text).join('\n\n'),
        paragraphs: results.flatMap((r) => r.paragraphs),
        tables: results.flatMap((r) => r.tables),
        figures: results.flatMap((r) => r.figures),
    };
}
