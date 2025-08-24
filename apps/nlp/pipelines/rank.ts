import { AutoModelForSequenceClassification, AutoTokenizer } from '@xenova/transformers';

type Model = Awaited<ReturnType<typeof AutoModelForSequenceClassification.from_pretrained>>;

type Tokenizer = Awaited<ReturnType<typeof AutoTokenizer.from_pretrained>>;

const modelName = 'jinaai/jina-reranker-v1-tiny-en';

let model: Model | undefined;

let tokenizer: Tokenizer | undefined;

async function getModel() {
    if (!model) {
        model = await AutoModelForSequenceClassification.from_pretrained(modelName, {
            quantized: false
        });
    }

    return model;
}

async function getTokenizer() {
    if (!tokenizer) {
        tokenizer = await AutoTokenizer.from_pretrained(modelName);
    }

    return tokenizer;
}

export async function rank(query: string, documents: string[], topK = 3) {
    const model = await getModel();
    const tokenizer = await getTokenizer();

    const inputs = tokenizer(new Array(documents.length).fill(query), {
        text_pair: documents,
        padding: true,
        truncation: true
    });

    const { logits } = await model(inputs);

    return logits
        .sigmoid()
        .tolist()
        .map(([score], i) => ({ index: i, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK) as { index: number; score: number }[];
}
