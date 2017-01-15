import { isEqual } from 'lodash'
import { Evaluator, CompleteGameInformation, Order } from '../types'


export const beatTutorial: Evaluator = (gameInfo: CompleteGameInformation, order: Order | undefined): number => {
  const { grid } = gameInfo.config.revealed
  const { turn } = gameInfo.state

  switch (turn) {
    case 0: return order === undefined ? 1 : 0
    case 1: return isEqual(order, { from: grid[3][5], to: grid[3][6], splitArmy: false }) ? 1 : 0
    case 2: return isEqual(order, { from: grid[3][6], to: grid[4][6], splitArmy: false }) ? 1 : 0
    case 3: return isEqual(order, { from: grid[4][6], to: grid[5][6], splitArmy: false }) ? 1 : 0
    case 4: return isEqual(order, { from: grid[5][6], to: grid[6][6], splitArmy: false }) ? 1 : 0
    case 5: return isEqual(order, { from: grid[6][6], to: grid[6][5], splitArmy: false }) ? 1 : 0
    default: throw new Error(`Unrecognized turn number: ${turn}`)
  }
}

export const random: Evaluator = (gameInfo: CompleteGameInformation, order: Order | undefined): number => {
  return Math.random()
}

export const doNothing: Evaluator = (gameInfo: CompleteGameInformation, order: Order | undefined): number => {
  return isEqual(order, undefined) ? 1 : 0
}
