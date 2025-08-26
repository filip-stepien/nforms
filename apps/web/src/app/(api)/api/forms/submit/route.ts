import { getErrorResponse, getResponse } from '@/api/lib/response';
import { parseFormSubmitBody } from '@/api/lib/request';
import { submitFormResponses } from '@/api/lib/services';
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function POST(req: NextRequest) {
    try {
        const body = parseFormSubmitBody(await req.json());
        await submitFormResponses(body);
        return getResponse(StatusCodes.OK);
    } catch (error) {
        return getErrorResponse(error);
    }
}

// accept preflight
export async function OPTIONS() {
    return getResponse(StatusCodes.OK);
}
