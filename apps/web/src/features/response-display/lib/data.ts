import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { FormResponseSchema } from '@packages/db/schemas/form-responses';
import 'server-only';

export async function findFirstResponseById(responseId: string) {
    await verifyUser();
    const response = await prisma.formResponse.findFirstOrThrow({ where: { id: responseId } });
    return FormResponseSchema.parse(response);
}
