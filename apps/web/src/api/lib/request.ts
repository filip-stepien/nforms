import z from 'zod';

const idSchema = z
    .string()
    .refine(val => /^[0-9a-fA-F]{24}$/.test(val), { message: 'Invalid ID format.' });

const requestBodySchema = z.object({
    formId: idSchema,
    fieldResponses: z.array(
        z.object({
            fieldId: idSchema,
            response: z.union([z.string(), z.array(z.string())])
        })
    )
});

export function parseRequestBody(body: unknown) {
    return requestBodySchema.parse(body);
}
