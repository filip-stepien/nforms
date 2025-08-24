import { getEmotionLabels } from 'pipelines/emotions';
import { rank } from 'pipelines/rank';
import { getSentimentLabels } from 'pipelines/sentiment';
import { getSummary } from 'pipelines/summary';
// import { createWorker, WorkerHandler } from '@packages/queue';

// const workerHandler: WorkerHandler = async () => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { text: 'ok' };
// };

// const worker = createWorker(workerHandler);

// worker.on('completed', job => console.log('Job completed:', job.id, job.data));

// worker.on('failed', (job, err) => console.log('Job failed:', job.id, err?.message));

// worker.on('error', err => console.error('Worker error:', err));

// worker.on('ready', () => console.log('Worker ready!'));

async function main() {
    const text =
        'The product met my expectations – it is well made, ' +
        'easy to use, and nicely packaged. ' +
        'I especially like the intuitive handling. ' +
        'The only thing that could be improved is slightly faster delivery. ' +
        'Overall, I am very satisfied and would gladly recommend it to friends.';

    const summaries = [
        'The product is well made, easy to use, and packaged nicely. Overall, the customer is satisfied and would recommend it.',
        'Good quality and intuitive product that met expectations. Delivery speed could be better, but overall satisfaction is high.',
        'The user appreciated the solid build and ease of use, noting packaging and intuitive handling. They would recommend it to others.',
        'The product met expectations with strong design and simple use. The only downside was slower delivery.',
        'Customer feedback highlights durability, ease of use, and satisfaction. Slight delay in shipping was the only issue.',
        'The review emphasizes intuitive handling, good packaging, and overall happiness with the purchase.'
    ];

    const summary = await getSummary(text);

    console.log(await getSentimentLabels(text));
    console.log(await getEmotionLabels(text));
    console.log(summary);
    console.log(await rank(summary, summaries));
}

main();
