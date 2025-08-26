import { prisma } from '@packages/db';
import { fieldExistsByFormId, fieldExistsById, formExistById, saveFieldResponse } from './data';
import { parseFormSubmitBody } from './request';
import { ApiError } from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { mapSelectionFieldToWidgetField } from '../mappers/fields/selection';
import { mapTextFieldToWidgetField } from '../mappers/fields/text';

export async function submitFormResponses({
    formId,
    fieldResponses
}: ReturnType<typeof parseFormSubmitBody>) {
    const formExists = await formExistById({ formId });

    if (!formExists) {
        throw new ApiError(
            'Form with provided ID does not exists.',
            { formId },
            StatusCodes.BAD_REQUEST
        );
    }

    const fieldsCheckResult = await Promise.all(
        fieldResponses.map(async ({ fieldId }) => {
            const existsById = await fieldExistsById({ fieldId });
            const existsByFormId = await fieldExistsByFormId({ fieldId, formId });
            return { fieldId, existsById, existsByFormId };
        })
    );

    const fieldsNotFound = fieldsCheckResult
        .filter(result => !result.existsById)
        .map(result => result.fieldId);

    if (fieldsNotFound.length > 0) {
        throw new ApiError(
            'Some fields with provided IDs do not exist.',
            { fieldIds: fieldsNotFound },
            StatusCodes.BAD_REQUEST
        );
    }

    const fieldsNotInForm = fieldsCheckResult
        .filter(result => result.existsById && !result.existsByFormId)
        .map(result => result.fieldId);

    if (fieldsNotInForm.length > 0) {
        throw new ApiError(
            'Some fields with provided IDs do not belong to the form.',
            { fieldIds: fieldsNotInForm },
            StatusCodes.BAD_REQUEST
        );
    }

    await prisma.$transaction(async transaction => {
        await Promise.all(
            fieldResponses.map(response => saveFieldResponse({ ...response, transaction }))
        );
    });
}

export async function getFormStructure({ formId }: { formId: string }) {
    const form = await prisma.form.findUnique({ where: { id: formId }, include: { fields: true } });

    if (!form) {
        throw new ApiError(
            'Form with provided ID does not exist.',
            { formId },
            StatusCodes.NOT_FOUND
        );
    }

    return form.fields.map(field => {
        switch (field.type) {
            case 'Text':
                return mapTextFieldToWidgetField(field);
            case 'Selection':
                return mapSelectionFieldToWidgetField(field);
            default:
                throw new Error(
                    `Unexpected field type "${field.type}" while trying to map to widget field.`
                );
        }
    });
}
