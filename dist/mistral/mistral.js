import { Mistral } from '@mistralai/mistralai';
import { generatePrompt } from './promp';
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });
const mistralIntegration = async (name, history) => {
    try {
        const dynamicPrompt = generatePrompt(name);
        const recentHistory = history.slice(-10);
        const messages = [
            { role: 'system', content: dynamicPrompt },
            ...recentHistory.map(({ role, content }) => ({ role, content })),
        ];
        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages,
        });
        return chatResponse.choices[0].message.content;
    }
    catch (error) {
        console.error('Error detallado:', JSON.stringify(error, null, 2));
        console.error('[Mistral Error]:', error);
        return `Parece que hemos tenido un pequeño problema al procesar tu solicitud. 😕 No te preocupes, en unos minutos podrás volver a hablar con la IA. 

        Mientras tanto, ¿qué te parece si nos ayudas a ir más allá de mirar y te unes a nuestra misión de denunciar? Puedes llenar este formulario para ser parte del cambio:
        
        👉 https://docs.google.com/forms/d/e/1FAIpQLSeE0eJV3r6ISvMcx3zAxI-mNCtu6Zb_6Lf_ihs2NdsBRIEUHw/viewform?usp=sf_link
        
        ¡Gracias por tu colaboración y por dar el paso de observador a agente de cambio! 🙌`;
    }
};
export default mistralIntegration;
