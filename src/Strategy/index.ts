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

export function getNonsplittingTileOrders(gameConfiguration: GameConfiguration, gameState: GameState, tile: Tile): Order[] {
  const possibleOrders = getPossibleOrders(gameConfiguration, gameState)
  const possibleTileOrders = _(possibleOrders)
    .filter(order => order.from === tile)
    .filter(order => !order.splitArmy)
    .value()
  return possibleTileOrders
}

export function getRandomOrder(gameConfiguration: GameConfiguration, gameState: GameState): Order | undefined {
  const possibleOrders = getPossibleOrders(gameConfiguration, gameState)
  return sample(possibleOrders)
}

export function stepAway(gameConfiguration: GameConfiguration, gameState: GameState, tile: Tile, origin: Tile): Order | undefined {
  const possibleOrders = getNonsplittingTileOrders(gameConfiguration, gameState, tile)
  const furthestDistance = _(possibleOrders).map(order => gameConfiguration.hidden.distances.get(origin)!.get(tile)).max()
  const possibleMarchOrders = possibleOrders.filter(order => gameConfiguration.hidden.distances.get(origin)!.get(order.to))
  return sample(possibleMarchOrders)
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

// export function* iterationTest (gameConfiguration: GameConfiguration, gameState: GameState): IterableIterator<Order | undefined> {
//   var index = 0;
//   while(index < 3) {
//     yield getRandomOrderForLargestArmy(gameConfiguration, gameState)
//   }
    
// }

export function earlyGame(gameConfiguration: GameConfiguration, gameState: GameState): Order | undefined {
  const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
  const myCrown = gameConfiguration.revealed.myCrown
  // if(myArmies.get(myCrown) < 10) return
  return   stepAway(gameConfiguration, gameState, myCrown, myCrown)
  // return getRandomOrderForLargestArmy(gameConfiguration, gameState)

}