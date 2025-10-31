import { createWorker, WorkerHandler } from '@packages/queue';
import { doResponseProcessingJob } from './lib/data';

const workerHandler: WorkerHandler = async ({ data }) => {
    const result = await doResponseProcessingJob(data);
    console.log(JSON.stringify(result, null, 2));
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
