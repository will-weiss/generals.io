import BrowserGame from './BrowserGame'
import GameConfiguration from './GameConfiguration'
import createGameState from './GameState'
import { Order, GameState, Strategy } from './types'


export default function playGame(connection: BrowserGame, strategy: Strategy): Promise<any> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const orders: Order[] = strategy(gameConfiguration, gameState)
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

    connection.on('gameOver', state => {
      console.log('gameOver', state)
      resolve(state)
    })

    connection.on('error', error => reject(error))
  })
}
