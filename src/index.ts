import BrowserGame from './BrowserGame'
import playGame from './playGame'
import { getRandomOrderForLargestArmy } from './Strategy'
import { VisibleGameInformation } from './types'


function main(): Promise<VisibleGameInformation> {
  const connection = new BrowserGame()
  return playGame(connection, getRandomOrderForLargestArmy)
}

main().then(console.log, console.error)

process.on('unhandledRejection', err => console.error(err))
