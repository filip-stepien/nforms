import { Emotion } from '../pipelines/emotions';
import { Sentiment } from '../pipelines/sentiment';
import { prisma } from '@packages/db';
import { getSummary } from '../pipelines/summary';
import { rank } from '../pipelines/rank';
import { JsonValue } from '@packages/db/generated/runtime/library';

async function findFieldResponse(responseId: string) {
    return await prisma.fieldResponse.findUniqueOrThrow({
        where: { id: responseId }
    });
}

async function findFormSummaries(formId: string) {
    return await prisma.responseSummary.findMany({
        where: { languageProcessings: { some: { fieldResponse: { formField: { formId } } } } }
    });
}

async function saveSummary(summary: string) {
    return await prisma.responseSummary.create({
        data: { summary }
    });
}

async function updateLanguageProcessingSummary(fieldResponseId: string, summaryId: string) {
    return await prisma.languageProcessing.update({
        where: { fieldResponseId },
        data: { summary: { connect: { id: summaryId } } }
    });
}

function canSummarizeResponse(responseJson: JsonValue): responseJson is { value: string } {
    return typeof (responseJson as { value: string | undefined })?.value === 'string';
}

export async function saveFieldResponseSummary(
    formId: string,
    fieldResponseId: string
): Promise<{
    id: string;
    sentiment: string;
    emotions: string[];
    summaryId: string;
    fieldResponseId: string;
}> {
    const fieldResponse = await findFieldResponse(fieldResponseId);

    if (!canSummarizeResponse(fieldResponse.response)) {
        throw new Error("Can't summarize non-text responses.");
    }

    const formSummaryEntries = await findFormSummaries(formId);
    const newSummary = await getSummary(fieldResponse.response.value);
    const [{ score, index }] = await rank({
        query: newSummary,
        documents: formSummaryEntries.map(({ summary }) => summary),
        topK: 1
    });

    const confidenceThreshold = 0.6;
    const summaryEntry =
        score > confidenceThreshold ? formSummaryEntries[index] : await saveSummary(newSummary);

    return await updateLanguageProcessingSummary(fieldResponse.id, summaryEntry.id);
}

export async function saveFieldResponseProcessing({
    fieldResponseId,
    summaryId,
    emotions,
    sentiment
}: {
    fieldResponseId: string;
    summaryId?: string;
    sentiment: Sentiment;
    emotions: Emotion[];
}) {
    await prisma.languageProcessing.create({
        data: {
            sentiment,
            emotions,
            fieldResponse: { connect: { id: fieldResponseId } },
            summary: { connect: { id: summaryId } }
        }
    });
}
