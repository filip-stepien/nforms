import { parseFormGetParams } from '@/api/lib/request';
import { getErrorResponse, getResponse } from '@/api/lib/response';
import { getFormStructure } from '@/api/lib/services';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const formId = await parseFormGetParams(params);
        return getResponse(StatusCodes.OK, await getFormStructure({ formId }));
    } catch (error) {
        console.log(error);
        return getErrorResponse(error);
    }
}
