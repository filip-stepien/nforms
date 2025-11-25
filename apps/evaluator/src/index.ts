import { createWorker, WorkerHandler } from '@packages/queue';
import { evaluateResponses, saveFormResponse } from './lib/responses';

const workerHandler: WorkerHandler = async ({ data }) => {
    const { email, form, responses } = data;
    const evaluatedResponses = await evaluateResponses(responses, form);
    await saveFormResponse(form.id, { formId: form.id, email, ...evaluatedResponses });
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
