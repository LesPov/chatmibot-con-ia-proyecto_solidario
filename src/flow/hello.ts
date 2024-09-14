import BotWatsapp from '@bot-whatsapp/bot';
import mistralIntegration from '../mistral/mistral';
import flow from '.';

const GREETING_KEYWORDS = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'];

export default BotWatsapp.addKeyword(BotWatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state }) => {
        try {
            const currentState = state.getMyState() || {};
            const newHistory = currentState.history || [];
            const name = ctx?.pushName ?? '';
            const userInput = ctx.body.toLowerCase();
            
            console.log(`[HISTORY]:`, newHistory);

            // Verificar si es un saludo y si ya se ha saludado antes
            const isGreeting = GREETING_KEYWORDS.some(keyword => userInput.includes(keyword));
            if (isGreeting && currentState.hasGreeted) {
                await flowDynamic('Ya nos saludamos. ¿En qué puedo ayudarte?');
                return;
            }

            // Actualizar el estado de saludo
            if (isGreeting) {
                currentState.hasGreeted = true;
            }

            // Agregar el mensaje del usuario al historial
            newHistory.push({ role: 'user', content: ctx.body });

            // Generar una respuesta coherente basada en el historial reciente
            const response = await mistralIntegration(name, newHistory);

            // Dividir y enviar la respuesta
            const chunks = response.split(/(?<!\d)\.\s+/g);
            for (const chunk of chunks) {
                if (chunk.trim()) {
                    await flowDynamic(chunk.trim());
                }
            }

            // Agregar la respuesta del asistente al historial
            newHistory.push({ role: 'assistant', content: response });

            // Actualizar el estado
            await state.update({ 
                ...currentState, 
                history: newHistory,
                lastResponse: response 
            });

        } catch (error) {
            console.error('[ERROR]', error);
            await flowDynamic('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
        }
    })
