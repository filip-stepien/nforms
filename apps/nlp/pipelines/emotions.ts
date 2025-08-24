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

export async function getEmotionLabels(text: string, topK = 3) {
    const pipe = await pipeline(
        'text-classification',
        'TrumpMcDonaldz/bert-43-multilabel-emotion-detection-ONNX'
    );

    const labels = await pipe(text, { topk: topK });
    return labels as { label: Emotion; score: number }[];
}
