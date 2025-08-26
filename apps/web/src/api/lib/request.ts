import z from 'zod';

const idSchema = z
    .string()
    .refine(val => /^[0-9a-fA-F]{24}$/.test(val), { message: 'Invalid ID format.' });

const formSubmitBodySchema = z.object({
    formId: idSchema,
    fieldResponses: z.array(
        z.object({
            fieldId: idSchema,
            response: z.union([z.string(), z.array(z.string())])
        })
    )
});

export function parseFormSubmitBody(body: unknown) {
    return formSubmitBodySchema.parse(body);
}

export async function parseFormGetParams(params: Promise<{ id: string }>) {
    const id = (await params).id;
    return idSchema.parse(id);
}
