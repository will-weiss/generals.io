import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameState } from '../types'


export default function playGame(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameState> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const orders: Order[] = strategy(gameConfiguration, gameState)
      return connection.submitOrders(orders).catch(reject)
    }

    function onGameStart(visibleState: VisibleGameState): void {
      gameConfiguration = new GameConfiguration('Anonymous', visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    function onNextTurn(visibleState: VisibleGameState): void {
      gameConfiguration = gameConfiguration.update(visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    connection.once('start', onGameStart)
    connection.on('nextTurn', onNextTurn)
    connection.on('gameOver', resolve)
    connection.on('error', error => reject(error))
  })
}
