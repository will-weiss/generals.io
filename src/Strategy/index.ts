import { sample } from 'lodash'
import { Tile, Order, GameState, GameConfiguration } from '../types'


export function getRandomOrders(gameConfiguration: GameConfiguration, gameState: GameState): Order[] {
  const myArmies = gameState.armies.get(gameConfiguration.revealed.myColor)!
  const orders: Order[] = []

  for (const [from, armySize] of myArmies.entries()) {
    if (armySize < 1) continue
    const to: Tile | undefined = sample(Array.from(gameConfiguration.revealed.adjacencies.get(from)!))
    if (!to) continue
    orders.push({ from, to, splitArmy: Math.random() < 0.5 })
    if (orders.length > 1) break
  }

  return orders
}
