import { getPossibleOrders } from '../../computableGameInformation'
import { Order, CompleteGameInformation } from '../../types'

export default function beatTutorial(gameInfo: CompleteGameInformation): Order | undefined {
  const { grid } = gameInfo.config.revealed
  const { turn } = gameInfo.state
  
  switch (turn) {
    case 0: return { from: grid[3][5], to: grid[3][6], splitArmy: false }
    case 1: return { from: grid[3][6], to: grid[4][6], splitArmy: false }
    case 2: return { from: grid[4][6], to: grid[5][6], splitArmy: false }
    case 3: return { from: grid[5][6], to: grid[6][6], splitArmy: false }
    case 4: return { from: grid[6][6], to: grid[6][5], splitArmy: false }
    default: throw new Error(`Unrecognized turn number: ${turn}`)
  }
}
