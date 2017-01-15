import cli from './cli'
import { botName, botPort } from './config'

cli
  .delimiter(`${botName}~$`)
  .listen(botPort)
  .show()


process.on('unhandledRejection', err => console.error(err))
