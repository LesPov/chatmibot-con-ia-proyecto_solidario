import "dotenv/config"
import BotWatsapp from '@bot-whatsapp/bot'
import database from './database/database'
import provider from './provider/provider'
import flow from './flow'

console.log("MISTRAL_API_KEY:", process.env.MISTRAL_API_KEY);


const main = async () => {

  await BotWatsapp.createBot({
    database,
    provider,
    flow

  })

}
main()