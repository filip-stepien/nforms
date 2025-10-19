import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { Form, FormSchema } from '@packages/db/schemas/form';

export async function getFormById(id: string): Promise<Form> {
    await verifyUser();
    const form = await prisma.form.findFirstOrThrow({ where: { id } });
    return FormSchema.parse(form);
}
