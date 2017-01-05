import _ = require('lodash')
import { sample } from 'lodash'
import { Tile, Order, GameState, GameConfiguration } from '../types'



export function getPossibleOrders(gameConfiguration: GameConfiguration, gameState: GameState): Order[] {
  const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
  const orders: Order[] = []

  for (const [from, armySize] of myArmies.entries()) {
    if (armySize < 2) continue
    const adjacencies = gameConfiguration.hidden.adjacencies.get(from)!
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

export function getRandomOrderForLargestArmy(gameConfiguration: GameConfiguration, gameState: GameState): Order | undefined {
  const possibleOrders = getPossibleOrders(gameConfiguration, gameState)
  const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
  const largestArmySize = _(possibleOrders).map(order => myArmies.get(order.from)!).max()
  const possibleOrdersForLargestArmyWithoutSplitting = _(possibleOrders)
    .filter(order => !order.splitArmy)
    .filter(order => myArmies.get(order.from)! >= largestArmySize)
    .value()

  return sample(possibleOrdersForLargestArmyWithoutSplitting)
}
