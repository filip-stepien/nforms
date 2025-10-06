import diff from 'deep-diff';

export function truncateText(text: string, maxLength: number) {
    const ellipsis = '...';
    return text.length > maxLength ? text.slice(0, maxLength - ellipsis.length) + ellipsis : text;
}

export function keysEqual(expected: unknown, actual: unknown) {
    const differences = diff(expected, actual);

    if (!differences) {
        return true;
    }

    return differences.every(change => {
        switch (change.kind) {
            case 'E':
                return typeof change.lhs === typeof change.rhs;
            case 'A':
                return true;
            default:
                return false;
        }
    });
}

export function printKeysOrType(value: unknown): string {
    if (value === null) {
        return 'null';
    }

    if (typeof value === 'object') {
        return `{ ${Object.keys(value).sort().join(', ')} }`;
    }

    return typeof value;
}
