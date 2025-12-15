export function enumValues<
    T extends Record<string, string | number>,
    R extends string | number = string | number
>(obj: T): R[] {
    return Object.values(obj) as R[];
}

export function uniqueArray<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}
