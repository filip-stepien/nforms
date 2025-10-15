export function truncateText(text: string, maxLength: number) {
    const ellipsis = '...';
    return text.length > maxLength ? text.slice(0, maxLength - ellipsis.length) + ellipsis : text;
}
