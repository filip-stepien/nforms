import { createWorker, WorkerHandler } from '@packages/queue';
import { saveFieldResponseProcessing } from './lib/data';

const workerHandler: WorkerHandler = async ({ data }) => {
    await saveFieldResponseProcessing(data);
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id, job.data));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
