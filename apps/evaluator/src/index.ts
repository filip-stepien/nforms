import { createWorker, WorkerHandler } from '@packages/queue';
import { getResponses } from './lib/responses';
import { saveFormResponse } from './lib/data';

const workerHandler: WorkerHandler = async ({ data }) => {
    const { email, form, responses } = data;
    await saveFormResponse(form.id, {
        email,
        responses: await getResponses(responses, form)
    });
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
