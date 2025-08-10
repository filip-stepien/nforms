export function debug_wait(ms: number = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
