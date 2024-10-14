import BotWatsapp from '@bot-whatsapp/bot';
import mistralIntegration from '../mistral/mistral';
const GREETING_KEYWORDS = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'];
export default BotWatsapp.addKeyword(BotWatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state }) => {
    try {
        const currentState = state.getMyState() || {};
        const newHistory = currentState.history || [];
        const name = ctx?.pushName ?? '';
        const userInput = ctx.body.toLowerCase();
        console.log(`[HISTORY]:`, newHistory);
        const isGreeting = GREETING_KEYWORDS.some(keyword => userInput.includes(keyword));
        if (isGreeting && currentState.hasGreeted) {
            await flowDynamic('Ya nos saludamos. ¿En qué puedo ayudarte?');
            return;
        }
        if (isGreeting) {
            currentState.hasGreeted = true;
        }
        newHistory.push({ role: 'user', content: ctx.body });
        const response = await mistralIntegration(name, newHistory);
        const chunks = response.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            if (chunk.trim()) {
                await flowDynamic(chunk.trim());
            }
        }
        newHistory.push({ role: 'assistant', content: response });
        await state.update({
            ...currentState,
            history: newHistory,
            lastResponse: response
        });
    }
    catch (error) {
        console.error('[ERROR]', error);
        await flowDynamic('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    }
});
