import BrowserGame from './BrowserGame'
import playGame from './playGame'
import { getRandomOrder } from './Strategy'
import { VisibleGameState } from './types'


function main(): Promise<VisibleGameState> {
  const connection = new BrowserGame()
  return playGame(connection, getRandomOrder)
}

main().then(console.log, console.error)

process.on('unhandledRejection', err => console.error(err))
