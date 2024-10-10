// mistral.ts
import { Mistral } from '@mistralai/mistralai';
import { generatePrompt } from './promp';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });
//TODO:

const mistralIntegration = async (name: string, history: any[]): Promise<string> => {
    try {
        const dynamicPrompt = generatePrompt(name);
        const recentHistory = history.slice(-10); // Solo usar las últimas 5 interacciones

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
        return `Parece que hemos tenido un pequeño problema al procesar tu solicitud. 😕 No te preocupes, en unos minutos podrás volver a hablar con la IA. 

Mientras tanto, puedes ayudarnos llenando este formulario. Más adelante, podrás experimentar con el chatbot inteligente y juntos mejoraremos el proceso.

Aquí está el formulario para que lo completes y conozcas mejor qué es y para qué servirá "Ojo con Eso": 
👉 https://docs.google.com/forms/d/e/1FAIpQLSeE0eJV3r6ISvMcx3zAxI-mNCtu6Zb_6Lf_ihs2NdsBRIEUHw/viewform?usp=sf_link

¡Gracias por tu colaboración! 🙌`;
    }
};

export default mistralIntegration;
