import { ZodError } from 'zod';
import { ApiError } from '../errors/ApiError';
import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { env } from '@packages/env';

export function getResponse(status: number, body?: unknown) {
    return NextResponse.json({ ok: true, statusCode: status, data: body }, { status });
}

function formatErrorResponse(message: string, statusCode: number, details?: unknown) {
    return NextResponse.json({ ok: false, message, statusCode, details }, { status: statusCode });
}

export function getErrorResponse(error: unknown) {
    if (error instanceof ZodError) {
        return formatErrorResponse(
            'Invalid request structure.',
            StatusCodes.BAD_REQUEST,
            error.issues
        );
    } else if (error instanceof ApiError) {
        const { message, status, details } = error;
        return formatErrorResponse(message, status, details);
    } else if (error instanceof Error) {
        return formatErrorResponse(
            'An unknown error occurred.',
            StatusCodes.INTERNAL_SERVER_ERROR,
            env.NODE_ENV === 'development' ? { message: error.message } : undefined
        );
    }
}
