import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameInformation } from '../types'


export default function playGame(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameInformation> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const order: Order | undefined = strategy(gameConfiguration, gameState)
      return connection.submitOrder(order).catch(reject)
    }

    function onGameStart(visibleState: VisibleGameInformation): void {
      gameConfiguration = new GameConfiguration('Anonymous', visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    function onNextTurn(visibleState: VisibleGameInformation): void {
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
