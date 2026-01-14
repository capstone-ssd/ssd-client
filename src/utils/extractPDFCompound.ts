import type { AzureExtractionResult } from './extractPDFWithAzure';
import { extractPDFWithAzure } from './extractPDFWithAzure';
import { extractPDFWithPDFJS } from './extractPDFWithPDFJS';

export interface PDFContent {
    text: string;
    paragraphs: Array<{ content: string; role?: string }>;
    tables: Array<{ rows: number; cols: number; data: string[][] }>;
    images: Array<{ data: string; width: number; height: number; pageNumber: number }>;
    figures: Array<{ id: string; caption?: string; boundingRegions: unknown }>;
    extractionMethod: 'pdfjs-only' | 'azure+pdfjs';
    cost: number;
    tablePagesNumbers?: number[];
}

export async function extractPDFCompound(file: File): Promise<PDFContent> {
    const pdfjsResult = await extractPDFWithPDFJS(file);

    if (pdfjsResult.hasTable) {
        const azureResults: AzureExtractionResult[] = [];
        const tablePages = pdfjsResult.tablePagesNumbers;

        for (let i = 0; i < tablePages.length; i += 2) {
            const chunk = tablePages.slice(i, i + 2);
            console.log(tablePages);

            const result = await extractPDFWithAzure(file, { pages: chunk });
            azureResults.push(result);
        }

        const mergedResult = mergeAzureResults(azureResults);

        return {
            text: mergedResult.text || pdfjsResult.text,
            paragraphs: mergedResult.paragraphs,
            tables: mergedResult.tables,
            images: pdfjsResult.images,
            figures: mergedResult.figures,
            extractionMethod: 'azure+pdfjs',
            cost: Math.ceil(tablePages.length / 2),
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
        cost: 0,
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
