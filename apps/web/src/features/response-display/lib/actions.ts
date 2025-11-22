'use server';

import { deleteResponseById } from './data';

export async function deleteResponseAction(responseId: string) {
    await deleteResponseById(responseId);
}
