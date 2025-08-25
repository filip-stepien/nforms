import { createWorker, WorkerHandler } from '@packages/queue';
import { saveFieldResponseProcessing, saveFieldResponseSummary } from './lib/data';
import { getEmotions } from './pipelines/emotions';
import { getSentiment } from './pipelines/sentiment';

const workerHandler: WorkerHandler = async job => {
    const { formId, fieldResponseId, text } = job.data;
    await saveFieldResponseProcessing({
        emotions: await getEmotions(text),
        sentiment: await getSentiment(text),
        summaryId: (await saveFieldResponseSummary(formId, fieldResponseId)).id,
        fieldResponseId
    });
};

const worker = createWorker(workerHandler);

worker.on('completed', job => console.log('Job completed:', job.id, job.data));

worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

worker.on('error', err => console.error('Worker error:', err));
