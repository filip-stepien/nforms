import { findFirstResponseById } from '@/features/response-display/lib/data';
import { notFound } from 'next/navigation';
import { Response } from '@/features/response-display/components/Response';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ResponseDetailsPage({ params }: Props) {
    const { id } = await params;

    try {
        const formResponse = await findFirstResponseById(id);
        // const form = await findFirstFormById(formResponse.formId);
        return <Response formResponse={formResponse} />;
    } catch {
        notFound();
    }
}
