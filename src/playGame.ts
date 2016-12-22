import BrowserGame from './BrowserGame'
import GameConfiguration from './GameConfiguration'
import createGameState from './GameState'
import { Order, GameState, Strategy, VisibleGameState } from './types'


export default function playGame(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameState> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const orders: Order[] = strategy(gameConfiguration, gameState)
      return connection.submitOrders(orders)
    }

    connection.once('start', (visibleState: VisibleGameState) => {
      console.log('start', visibleState.turn)
      gameConfiguration = new GameConfiguration('Anonymous', visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    })

    connection.on('nextTurn', (visibleState: VisibleGameState) => {
      console.log('nextTurn', visibleState.turn)
      gameConfiguration.update(visibleState)
      gameState = createGameState(gameConfiguration, visibleState, gameState)
      takeTurn()
    })

    connection.on('gameOver', (visibleState: VisibleGameState) => {
      console.log('gameOver', visibleState)
      resolve(visibleState)
    })

    connection.on('error', error => reject(error))
  })
}
