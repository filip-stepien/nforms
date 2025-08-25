import { pipeline } from '@xenova/transformers';

export async function getSummary(text: string) {
    const pipe = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    const [summary] = (await pipe(text, {
        min_new_tokens: 10,
        max_new_tokens: 20
    })) as [{ summary_text: string }];

    return summary.summary_text;
}
