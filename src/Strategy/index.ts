import _ = require('lodash')
import { sample } from 'lodash'
import getPossibleOrders from './getPossibleOrders'
import { Order, CompleteGameInformation } from '../types'


export function getRandomOrder(gameInfo: CompleteGameInformation): Order | undefined {
  const possibleOrders = getPossibleOrders(gameInfo)
  return sample(possibleOrders)
}

export function getRandomOrderForLargestArmy(gameInfo: CompleteGameInformation): Order | undefined {
  const { armies } = gameInfo.state
  const { myColor } = gameInfo.config.revealed

  const myArmies = armies.get(myColor)!
  const possibleOrders = getPossibleOrders(gameInfo)

  const largestArmySize = _(possibleOrders).map(order => myArmies.get(order.from)!).max()
  const possibleOrdersForLargestArmyWithoutSplitting = _(possibleOrders)
    .filter(order => !order.splitArmy)
    .filter(order => myArmies.get(order.from)! >= largestArmySize)
    .value()

  return sample(possibleOrdersForLargestArmyWithoutSplitting)
}
