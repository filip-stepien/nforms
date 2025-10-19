import 'server-only';
import { verifyUser } from '@/auth';
import { prisma } from '@packages/db';
import { Form, FormSchema } from '@packages/db/schemas/form';

export async function getFormById(id: string): Promise<Form> {
    await verifyUser();
    const form = await prisma.form.findFirstOrThrow({ where: { id } });
    return FormSchema.parse(form);
}

export async function deleteFormById(formId: string) {
    await verifyUser();
    await prisma.$transaction([
        prisma.formResponse.deleteMany({ where: { formId } }),
        prisma.form.delete({ where: { id: formId } })
    ]);
}
