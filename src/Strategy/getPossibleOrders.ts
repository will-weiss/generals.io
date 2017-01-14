import { Order, CompleteGameInformation } from '../types'


export default function getPossibleOrders(gameInfo: CompleteGameInformation): Order[] {
  const { armies } = gameInfo.state
  const { myColor } = gameInfo.config.revealed
  const { adjacencies } = gameInfo.config.hidden

  const myArmies = armies.get(myColor)!
  const orders: Order[] = []

  for (const [from, armySize] of myArmies.entries()) {
    if (armySize < 2) continue
    const adjacenciesFrom = adjacencies.get(from)!
    for (const to of adjacenciesFrom) {
      orders.push(
        { from, to, splitArmy: false },
        { from, to, splitArmy: true }
      )
    }
  }

  return orders
}

