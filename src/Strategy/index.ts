import { sample } from 'lodash'
import { Tile, Order, GameState, GameConfiguration } from '../types'


export function getPossibleOrders(gameConfiguration: GameConfiguration, gameState: GameState): Order[] {
  const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
  const orders: Order[] = []

  for (const [from, armySize] of myArmies.entries()) {
    if (armySize < 2) continue
    const adjacencies = gameConfiguration.revealed.adjacencies.get(from)!
    for (const to of adjacencies) {
      orders.push(
        { from, to, splitArmy: false },
        { from, to, splitArmy: true }
      )
    }
  }

  return orders
}

export function getRandomOrder(gameConfiguration: GameConfiguration, gameState: GameState): Order | undefined {
  const possibleOrders = getPossibleOrders(gameConfiguration, gameState)
  return sample(possibleOrders)
}
