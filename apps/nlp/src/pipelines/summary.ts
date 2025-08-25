import ollama from 'ollama';
import { env } from '@packages/env';

export async function getSummary(text: string) {
    const response = await ollama.chat({
        model: env.OLLAMA_MODEL,
        messages: [
            {
                role: 'system',
                content:
                    'You are an assistant that writes very short summaries in English. ' +
                    'Your summary must contain only the most important context of what the user wrote. ' +
                    'Always give only a very brief, high-level summary in one short sentence, ' +
                    'without details and any extra comments - no more than 10 words.'
            },
            {
                role: 'user',
                content: text
            }
        ]
    });

    return response.message.content;
}
