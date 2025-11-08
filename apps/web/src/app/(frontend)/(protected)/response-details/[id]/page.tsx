import { findFirstResponseById } from '@/features/response-display/lib/data';
import { notFound } from 'next/navigation';
import { Response } from '@/features/response-display/components/Response';
import { findFirstFormById } from '@/lib/data';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ResponseDetailsPage({ params }: Props) {
    const { id } = await params;

    try {
        const response = await findFirstResponseById(id);
        const form = await findFirstFormById(response.formId);
        return <Response response={response} form={form} />;
    } catch {
        notFound();
    }
}
