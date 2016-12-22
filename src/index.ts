import BrowserGame from './BrowserGame'
import GameConfiguration from './GameConfiguration'
import createGameState from './GameState'
import { getRandomOrders } from './Strategy'
import { Order, GameState } from './types'


function main(): void {
  const connection = new BrowserGame()
  let gameConfiguration: GameConfiguration
  let gameState: GameState

  function takeTurn(): Promise<void> {
    const orders: Order[] = getRandomOrders(gameConfiguration, gameState)
    return connection.submitOrders(orders)
  }

  connection.once('start', state => {
    console.log('start', state.turn)
    gameConfiguration = new GameConfiguration('Anonymous', state)
    gameState = createGameState(gameConfiguration, state)
    takeTurn()
  })

  connection.on('nextTurn', state => {
    console.log('nextTurn', state.turn)
    gameState = createGameState(gameConfiguration, state, gameState)
    takeTurn()
  })

  connection.on('gameOver', state => console.log('gameOver', state))
}

main()

process.on('unhandledRejection', err => console.error(err))
