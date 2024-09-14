import BotWatsapp from '@bot-whatsapp/bot'
import hello from './hello'

export default BotWatsapp.createFlow(
    [
        hello,
    ]
)