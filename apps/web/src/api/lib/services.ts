import { prisma } from '@packages/db';
import { fieldExistsByFormId, fieldExistsById, formExistById, saveFieldResponse } from './data';
import { parseRequestBody } from './request';
import { ApiError } from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

export async function submitFormResponses({
    formId,
    fieldResponses
}: ReturnType<typeof parseRequestBody>) {
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
