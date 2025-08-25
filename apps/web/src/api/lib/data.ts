import { prisma } from '@packages/db';
import { Prisma } from '@packages/db/generated';

export async function fieldExistsById({ fieldId }: { fieldId: string }) {
    const count = await prisma.formField.count({ where: { id: fieldId } });
    return count > 0;
}

export async function formExistById({ formId }: { formId: string }) {
    const count = await prisma.form.count({ where: { id: formId } });
    return count > 0;
}

export async function fieldExistsByFormId({
    formId,
    fieldId
}: {
    formId: string;
    fieldId: string;
}) {
    const count = await prisma.formField.count({ where: { id: fieldId, formId: formId } });
    return count > 0;
}

export async function saveFieldResponse({
    response,
    fieldId,
    transaction = prisma
}: {
    response: string | string[];
    fieldId: string;
    transaction?: Prisma.TransactionClient;
}) {
    return await transaction.fieldResponse.create({ data: { formFieldId: fieldId, response } });
}
