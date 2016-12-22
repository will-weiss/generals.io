import { sample } from 'lodash'
import BrowserGame from './BrowserGame'
import GameConfiguration from './GameConfiguration'
import createGameState from './GameState'
import { Tile, Order, GameState } from './types'


function main(): void {

  const connection = new BrowserGame()
  let gameConfiguration: GameConfiguration
  let gameState: GameState

  function takeRandomTurn(): Promise<void> {

    if (gameState.gameOver) return Promise.resolve()
    const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
    const orders: Order[] = []

    for (const [from, armySize] of myArmies.entries()) {
      if (armySize < 1) continue
      const to: Tile | undefined = sample(Array.from(gameConfiguration.revealed.adjacencies.get(from)!))
      if (!to) continue
      orders.push({ from, to, splitArmy: Math.random() < 0.5 })
      if (orders.length > 1) break
    }

    return connection.submitOrders(orders)
  }

  connection.once('start', state => {
    console.log('start', state.turn)
    gameConfiguration = new GameConfiguration('Anonymous', state)
    gameState = createGameState(gameConfiguration, state)
    takeRandomTurn()
  })

  connection.on('nextTurn', state => {
    console.log('nextTurn', state.turn)
    gameState = createGameState(gameConfiguration, state, gameState)
    takeRandomTurn()
  })

  connection.on('gameOver', state => console.log('gameOver', state))
}

main()

process.on('unhandledRejection', err => console.error(err))
