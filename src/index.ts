import BrowserGame from './BrowserGame'
import playGame from './playGame'
import { getRandomOrder } from './Strategy'
import { VisibleGameInformation } from './types'


function main(): Promise<VisibleGameInformation> {
  const connection = new BrowserGame()
  return playGame(connection, getRandomOrder)
}

main().then(console.log, console.error)

process.on('unhandledRejection', err => console.error(err))
