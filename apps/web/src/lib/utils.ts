import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function withPayloadType<T>() {
    return (t: T) => ({ payload: t });
}

export function formatActionName(sliceName: string, actionName: string) {
    return sliceName + '/' + actionName;
}
