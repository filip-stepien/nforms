import z from 'zod';

export enum LanguageProcessing {
    SENTIMENT = 'sentiment',
    EMOTION = 'emotion'
}

const SentimentProcessingSchema = z.object({
    sentiment: z.union([z.literal('positive'), z.literal('negative')])
});

const EmotionProcessingSchema = z.object({
    emotion: z.union([z.literal('happiness'), z.literal('anger')])
});

export const FieldLanguageProcessingSchema = z.object({
    id: z.string(),
    formId: z.string(),
    fieldId: z.string(),
    processing: z.union([SentimentProcessingSchema, EmotionProcessingSchema])
});

export type LanguageProcessingMap = {
    [LanguageProcessing.SENTIMENT]: z.infer<typeof SentimentProcessingSchema>;
    [LanguageProcessing.EMOTION]: z.infer<typeof EmotionProcessingSchema>;
};

export type FieldLanguageProcessing = z.infer<typeof FieldLanguageProcessingSchema>;
