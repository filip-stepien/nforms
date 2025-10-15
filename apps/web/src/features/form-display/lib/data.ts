import { prisma } from '@packages/db';

export async function getForm(id: string) {
    return prisma.form.findFirstOrThrow({ where: { id } });
}
