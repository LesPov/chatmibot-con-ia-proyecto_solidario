import "dotenv/config"
import BotWatsapp from '@bot-whatsapp/bot'
import database from './database/database'
import provider from './provider/provider'
import flow from './flow'



const main = async () => {

  await BotWatsapp.createBot({
    database,
    provider,
    flow

  })

}
main()