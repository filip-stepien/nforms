import { pipeline } from '@xenova/transformers';

export type Sentiment = 'positive' | 'negative';

async function getSentimentLabels(text: string, topK = 2) {
    const pipe = await pipeline(
        'sentiment-analysis',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
    );

    const sentiments = (await pipe(text, { topk: topK })) as {
        label: 'POSITIVE' | 'NEGATIVE';
        score: number;
    }[];

    return sentiments.map<{ label: Sentiment; score: number }>(sent => ({
        label: sent.label.toLowerCase() as Sentiment,
        score: sent.score
    }));
}

export async function getSentiment(text: string) {
    const [first, second] = await getSentimentLabels(text, 2);
    return first.score > second.score ? first.label : second.label;
}
