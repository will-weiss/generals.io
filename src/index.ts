import cli from './cli'
import { botName } from './config'

cli.delimiter(`${botName}~$`).show()

process.on('unhandledRejection', err => console.error(err))
