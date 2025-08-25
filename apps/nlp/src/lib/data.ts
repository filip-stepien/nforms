import { Emotion, getEmotions } from '../pipelines/emotions';
import { getSentiment, Sentiment } from '../pipelines/sentiment';
import { prisma } from '@packages/db';
import { getSummary } from '../pipelines/summary';
import { rank } from '../pipelines/rank';
import { Prisma } from '@packages/db/generated';
import { canSummarizeFieldResponse } from './utils';

async function findFieldResponseById({ fieldResponseId }: { fieldResponseId: string }) {
    return await prisma.fieldResponse.findFirst({ where: { id: fieldResponseId } });
}

async function findOrCreateSummaryByFormId({
    text,
    formId,
    transaction = prisma
}: {
    text: string;
    formId: string;
    transaction?: Prisma.TransactionClient;
}) {
    const formSummaryEntries = await transaction.responseSummary.findMany({
        where: { languageProcessings: { some: { fieldResponse: { formField: { formId } } } } }
    });

    const summary = await getSummary(text);
    const [{ score, index }] = await rank({
        query: summary,
        documents: formSummaryEntries.map(({ summary }) => summary),
        topK: 1
    });

    const confidenceThreshold = 0.6;

    return score > confidenceThreshold
        ? formSummaryEntries[index]
        : await transaction.responseSummary.create({ data: { summary } });
}

async function createOrUpdateLanguageProcessing({
    sentiment,
    emotions,
    summaryId,
    fieldResponseId,
    transaction = prisma
}: {
    sentiment: Sentiment;
    emotions: Emotion[];
    summaryId: string;
    fieldResponseId: string;
    transaction?: Prisma.TransactionClient;
}) {
    return await transaction.languageProcessing.upsert({
        where: { fieldResponseId },
        update: {
            sentiment,
            emotions,
            summary: { connect: { id: summaryId } }
        },
        create: {
            sentiment,
            emotions,
            fieldResponse: { connect: { id: fieldResponseId } },
            summary: { connect: { id: summaryId } }
        }
    });
}

export async function saveFieldResponseProcessing({
    formId,
    fieldResponseId
}: {
    formId: string;
    fieldResponseId: string;
}) {
    const textEntry = await findFieldResponseById({ fieldResponseId });

    if (!canSummarizeFieldResponse(textEntry.response)) {
        throw new Error('Unable to summarize non-text responses.');
    }

    const text = textEntry.response.value;

    await prisma.$transaction(async transaction => {
        const sentiment = await getSentiment(text);
        const emotions = await getEmotions(text);

        const { id: summaryId } = await findOrCreateSummaryByFormId({
            text,
            formId,
            transaction
        });

        await createOrUpdateLanguageProcessing({
            sentiment,
            emotions,
            summaryId,
            fieldResponseId,
            transaction
        });
    });
}
