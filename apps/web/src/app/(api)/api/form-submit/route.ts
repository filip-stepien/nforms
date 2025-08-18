import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const requestBodySchema = z.array(
    z.object({
        fieldId: z.string().min(1),
        response: z.union([z.string(), z.array(z.string())])
    })
);

export async function POST(req: NextRequest) {
    const body = requestBodySchema.safeParse(await req.json());

    if (body.error) {
        return NextResponse.json(
            { ok: false, message: body.error.issues },
            { status: StatusCodes.BAD_REQUEST }
        );
    }

    return NextResponse.json({ ok: true }, { status: StatusCodes.OK });
}
