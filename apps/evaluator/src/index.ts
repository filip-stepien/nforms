import { createWorker, FieldResponseQueueJobResult, WorkerHandler } from '@packages/queue';
import { getResponses } from './lib/responses';

const workerHandler: WorkerHandler = async ({ data }) => {
    const { email, form, responses } = data;

    const result: FieldResponseQueueJobResult = {
        email,
        formId: form.id,
        responses: await getResponses(responses, form)
    };

    console.log(JSON.stringify(result, null, 2));
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
