import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameInformation } from '../types'


export default function playGame(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameInformation> {
  return new Promise((resolve, reject) => {
    let config: GameConfiguration
    let state: GameState

    function takeTurn(): Promise<void> {
      const order: Order | undefined = strategy(gameInfomration)
      return connection.submitOrder(order).catch(reject)
    }

    function onGameStart(visibleState: VisibleGameInformation): void {
      config = new GameConfiguration('Anonymous', visibleState)
      state = createGameState(config, visibleState)
      takeTurn()
    }

    function onNextTurn(visibleState: VisibleGameInformation): void {
      config = config.update(visibleState)
      state = createGameState(config, visibleState)
      takeTurn()
    }

    connection.once('start', onGameStart)
    connection.on('nextTurn', onNextTurn)
    connection.on('gameOver', resolve)
    connection.on('error', error => reject(error))
  })
}
