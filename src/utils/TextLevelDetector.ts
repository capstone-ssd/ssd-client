interface TextItem {
    text: string;
    fontSize: number;
}

type MarkdownRole = '#' | '##' | '###' | '';

export class TextLevelDetector {
    private roleMap = new Map<number, MarkdownRole>();

    constructor(items: TextItem[]) {
        this.analyze(items);
    }

    private analyze(items: TextItem[]): void {
        const fontSizeMap = new Map<number, number>();

        items.forEach((item) => {
            const size = Math.round(item.fontSize * 10) / 10;
            fontSizeMap.set(size, (fontSizeMap.get(size) || 0) + 1);
        });

        // 빈도순 정렬
        const sortedSizes = Array.from(fontSizeMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([size]) => size);

        if (sortedSizes.length === 0) return;

        // 가장 많은 크기들은 본문으로 취급
        const bodySize = sortedSizes[0];
        this.roleMap.set(bodySize, '');

        // 본문보다 큰 크기들은 제목으로 간주하고 크기순으로 할당
        const largerSizes = sortedSizes.filter((size) => size > bodySize).sort((a, b) => b - a);

        if (largerSizes.length >= 1) this.roleMap.set(largerSizes[0], '#');
        if (largerSizes.length >= 2) this.roleMap.set(largerSizes[1], '##');
        if (largerSizes.length >= 3) this.roleMap.set(largerSizes[2], '###');

        // 나머지는 본문 취급
        sortedSizes.forEach((size) => {
            if (!this.roleMap.has(size)) {
                this.roleMap.set(size, '');
            }
        });
    }

    getRole(fontSize: number): MarkdownRole {
        const size = Math.round(fontSize * 10) / 10;
        return this.roleMap.get(size) || '';
    }
}
