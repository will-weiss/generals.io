import { CompleteGameInformation, Armies } from '../../types'


export default function getMyArmies(gameInfo: CompleteGameInformation): Armies {
  const { armies } = gameInfo.state
  const { myColor } = gameInfo.config.revealed
  return armies.get(myColor)!
}
