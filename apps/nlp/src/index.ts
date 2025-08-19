import { createWorker, WorkerHandler } from '@packages/queue';

const workerHandler: WorkerHandler = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { text: 'ok' };
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id, job.data));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));

worker.on('ready', () => console.log('Worker ready!'));
