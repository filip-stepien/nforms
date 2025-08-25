import { getErrorResponse, getResponse } from '@/api/lib/response';
import { parseRequestBody } from '@/api/lib/request';
import { submitFormResponses } from '@/api/lib/services';
import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await submitFormResponses(parseRequestBody(body));
        return getResponse(StatusCodes.OK);
    } catch (error) {
        return getErrorResponse(error);
    }
}
