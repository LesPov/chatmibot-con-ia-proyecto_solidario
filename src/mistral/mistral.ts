// mistral.ts
import { Mistral } from '@mistralai/mistralai';
import { generatePrompt } from './promp';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });
//TODO:

const mistralIntegration = async (name: string, history: any[]): Promise<string> => {
    try {
        const dynamicPrompt = generatePrompt(name);
        const recentHistory = history.slice(-5); // Solo usar las últimas 5 interacciones


        const messages = [
            { role: 'system', content: dynamicPrompt },
            ...recentHistory.map(({ role, content }) => ({ role, content })),
            
        ];

        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages,
        });

        return chatResponse.choices[0].message.content;
    } catch (error) {
        console.error('[Mistral Error]:', error);
        return 'Lo siento, hubo un error al procesar tu solicitud.';
    }
};

export default mistralIntegration;