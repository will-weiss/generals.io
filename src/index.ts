import BrowserGame from './BrowserGame'
import { getRandomOrders } from './Strategy'
import playGame from './playGame'


function main(): Promise<void> {
  const connection = new BrowserGame()
  return playGame(connection, getRandomOrders)
}

main()

process.on('unhandledRejection', err => console.error(err))
