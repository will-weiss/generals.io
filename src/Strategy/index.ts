import _ = require('lodash')
import { sample } from 'lodash'
import getPossibleOrders from './getPossibleOrders'
import { Order, GameState, GameConfiguration } from '../types'


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
