export function truncateText(text: string, maxLength: number) {
    const ellipsis = '...';
    return text.length > maxLength ? text.slice(0, maxLength - ellipsis.length) + ellipsis : text;
}

export function capitalizeFirstLetter(str: string) {
    return str ? str[0].toUpperCase() + str.slice(1) : str;
}
