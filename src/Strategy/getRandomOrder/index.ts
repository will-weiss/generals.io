import { sample } from 'lodash'
import { getPossibleOrders } from '../../computableGameInformation'
import { Order, CompleteGameInformation } from '../../types'


export default function getRandomOrder(gameInfo: CompleteGameInformation): Order | undefined {
  const possibleOrders = getPossibleOrders(gameInfo)
  return sample(possibleOrders)
}
