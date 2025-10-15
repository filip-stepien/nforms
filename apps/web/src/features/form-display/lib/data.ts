import { prisma } from '@packages/db';
import { formSchema } from '@packages/db/schemas/form';

export async function getForm(id: string) {
    const form = await prisma.form.findFirstOrThrow({ where: { id } });
    const parseResult = formSchema.safeParse(form);

    if (parseResult.error) {
        console.error(
            `Form parse error. Issues: \n${JSON.stringify(parseResult.error.issues, null, 2)}`
        );

        throw new Error();
    }

    return parseResult.data;
}
