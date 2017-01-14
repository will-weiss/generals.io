import _ = require('lodash')
import { sample } from 'lodash'
import { Tile, Order, GameState, GameConfiguration, CompleteGameInformation} from '../types'



export function getPossibleOrders(gameInformation: CompleteGameInformation): Order[] {
  const {config, state} = gameInformation
  const myArmies = state.armies.get(config.revealed.myColor)!
  const orders: Order[] = []

  for (const [from, armySize] of myArmies.entries()) {
    if (armySize < 2) continue
    const adjacencies = config.hidden.adjacencies.get(from)!
    for (const to of adjacencies) {
      orders.push(
        { from, to, splitArmy: false },
        { from, to, splitArmy: true }
      )
    }
  }

  return orders
}

export function getNonsplittingTileOrders(gameInformation: CompleteGameInformation, tile: Tile): Order[] {
  const possibleOrders = getPossibleOrders(gameInformation)
  const possibleTileOrders = _(possibleOrders)
    .filter(order => order.from === tile)
    .filter(order => !order.splitArmy)
    .value()

  return possibleTileOrders
}

export function getRandomOrder(gameInformation: CompleteGameInformation): Order | undefined {
  const {config, state} = gameInformation  
     const possibleOrders = getPossibleOrders(gameInformation)
  return sample(possibleOrders)
}

export function stepAway(gameInformation: CompleteGameInformation, from: Tile, origin: Tile): Order | undefined {
  const {config, state} = gameInformation
  const possibleOrders = getNonsplittingTileOrders(gameInformation, from)
  const furthestDistance = _(possibleOrders).map(order => config.hidden.distances.get(origin)!.get(from)).max()
  const possibleMarchOrders = possibleOrders.filter(order => config.hidden.distances.get(origin)!.get(order.to))
  return sample(possibleMarchOrders)
}

export function* marchAway(gameInformation: CompleteGameInformation, firstTile: Tile, origin: Tile): IterableIterator <Order | undefined > {
  const {config, state} = gameInformation
  const activeTile = firstTile
  const myArmies = state.armies.get(config.revealed.myColor)!
  const firstTileSize = myArmies.get(firstTile)
  while (true) {
    // order = 
    yield stepAway(gameInformation, activeTile, origin)

  }
}


export function getRandomOrderForLargestArmy(gameInformation: CompleteGameInformation): Order | undefined {
  const {config, state} = gameInformation
  const possibleOrders = getPossibleOrders(gameInformation)
  const myArmies = state.armies.get(config.revealed.myColor)!
  const largestArmySize = _(possibleOrders).map(order => myArmies.get(order.from)!).max()
  const possibleOrdersForLargestArmyWithoutSplitting = _(possibleOrders)
    .filter(order => !order.splitArmy)
    .filter(order => myArmies.get(order.from)! >= largestArmySize)
    .value()

  return sample(possibleOrdersForLargestArmyWithoutSplitting)
}

export function* iterationTest (gameInformation: CompleteGameInformation): IterableIterator<Order | undefined> {
  var index = 0;
  while(index < 3) {
    yield getRandomOrderForLargestArmy(gameInformation)
  }
    
}



export function earlyGame(gameInformation: CompleteGameInformation): Order | undefined {
  const {config, state} = gameInformation
  const myArmies = state.armies.get(config.revealed.myColor)!
  const myCrown = config.revealed.myCrown
  // if(myArmies.get(myCrown) < 10) return
  return   stepAway(gameInformation, myCrown, myCrown)
  // return getRandomOrderForLargestArmy(config, state)

}