import { pipeline, AutoTokenizer, AutoModelForSequenceClassification } from '@xenova/transformers';
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
    const model_id = 'jinaai/jina-reranker-v1-tiny-en';
    const model = await AutoModelForSequenceClassification.from_pretrained(model_id, {
        quantized: false
    });
    const tokenizer = await AutoTokenizer.from_pretrained(model_id);

    async function rank(query, documents, { top_k = undefined, return_documents = false } = {}) {
        const inputs = tokenizer(new Array(documents.length).fill(query), {
            text_pair: documents,
            padding: true,
            truncation: true
        });
        const { logits } = await model(inputs);
        return logits
            .sigmoid()
            .tolist()
            .map(([score], i) => ({
                corpus_id: i,
                score,
                ...(return_documents ? { text: documents[i] } : {})
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, top_k);
    }

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

    const getSentimentLabels = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
    );

    const getEmotionLabels = await pipeline(
        'text-classification',
        'TrumpMcDonaldz/bert-43-multilabel-emotion-detection-ONNX'
    );

    const getSummary = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');

    const summary = await getSummary(text, {
        min_new_tokens: 10,
        max_new_tokens: 20
    });

    console.log(await getSentimentLabels(text));
    console.log(await getEmotionLabels(text));
    console.log(summary);
    console.log(
        await rank((summary.at(0) as { summary_text: string }).summary_text, summaries, {
            return_documents: true
        })
    );
}

main();
