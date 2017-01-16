import { maxBy, mapValues } from 'lodash'
import { Strategy, Evaluator, Order, CompleteGameInformation } from '../types'
import { getPossibleOrders } from '../computableGameInformation'
import * as Evaluators from '../Evaluators'


function genStrategy(evaluator: Evaluator): Strategy {
  return function(gameInfo: CompleteGameInformation): Order | undefined {
    const possibleOrders = getPossibleOrders(gameInfo)
    return maxBy(possibleOrders, order => evaluator(gameInfo, order))
  }
}

type StrategyKey = keyof typeof Evaluators

const Strategies: { [strategyKey in StrategyKey]: Strategy } = mapValues(Evaluators, genStrategy) as any

export = Strategies
