export function truncateText(text: string, maxLength: number) {
    const ellipsis = '...';
    return text.length > maxLength ? text.slice(0, maxLength - ellipsis.length) + ellipsis : text;
}

export function stripId<T extends { id?: unknown }>(obj: T): Omit<T, 'id'> {
    const { id: _, ...rest } = obj;
    return rest;
}
