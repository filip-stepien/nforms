import { pipeline } from '@xenova/transformers';

export type Emotion =
    | 'admiration'
    | 'amusement'
    | 'anger'
    | 'annoyance'
    | 'approval'
    | 'caring'
    | 'confusion'
    | 'curiosity'
    | 'desire'
    | 'disappointment'
    | 'disapproval'
    | 'disgust'
    | 'embarrassment'
    | 'excitement'
    | 'fear'
    | 'gratitude'
    | 'grief'
    | 'joy'
    | 'love'
    | 'nervousness'
    | 'optimism'
    | 'pride'
    | 'realization'
    | 'relief'
    | 'remorse'
    | 'sadness'
    | 'surprise'
    | 'neutral'
    | 'worry'
    | 'happiness'
    | 'fun'
    | 'hate'
    | 'autonomy'
    | 'safety'
    | 'understanding'
    | 'empty'
    | 'enthusiasm'
    | 'recreation'
    | 'sense of belonging'
    | 'meaning'
    | 'sustenance'
    | 'creativity'
    | 'boredom';

async function getEmotionLabels(text: string, topK = 100) {
    const pipe = await pipeline(
        'text-classification',
        'TrumpMcDonaldz/bert-43-multilabel-emotion-detection-ONNX'
    );

    const labels = await pipe(text, { topk: topK });
    return labels as { label: Emotion; score: number }[];
}

export async function getEmotion(text: string) {
    const labels = await getEmotionLabels(text);
    return labels.map(({ label }) => label).at(0);
}
