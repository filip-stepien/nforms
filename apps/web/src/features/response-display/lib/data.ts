import 'server-only';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { FormResponseSchema } from '@packages/db/schemas/form-responses';

export async function findFirstResponseById(responseId: string) {
    await verifyUser();
    const response = await prisma.formResponse.findFirstOrThrow({ where: { id: responseId } });
    return FormResponseSchema.parse(response);
}

export async function deleteResponseById(responseId: string) {
    await verifyUser();
    await prisma.formResponse.delete({ where: { id: responseId } });
}
