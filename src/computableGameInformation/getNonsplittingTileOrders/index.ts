import { Order, CompleteGameInformation, Tile } from '../../types'
import { getPossibleOrders } from '../../computableGameInformation'


export default function getNonsplittingTileOrders(gameInfo: CompleteGameInformation, tile: Tile): Order[] {
  return getPossibleOrders(gameInfo).filter(order => order && (order.from === tile && !order.splitArmy)) as Order[]
}