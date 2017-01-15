import { expect } from 'chai'
import sampleFirstTurnVisibleGameInformation from '../../sampleFirstTurnVisibleGameInformation'
import { Order, GameState } from '../../types'
import GameConfiguration from '../../GameConfiguration'
import createGameState from '../../GameState'
import getNonsplittingTileOrders from './index'


describe('getNonsplittingTileOrders', () => {
  it('returns an array of possble orders given a specific tile, the game state, and game configuration', () => {
    const gameConfiguration: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
    const gameState: GameState = createGameState(gameConfiguration, sampleFirstTurnVisibleGameInformation)
    const gameInfo = { config: gameConfiguration, state: gameState }
    const tile = gameConfiguration.revealed.grid[0][0]
    const possibleTileOrders: Order[] = getNonsplittingTileOrders(gameInfo, tile)
    expect(possibleTileOrders).to.be.an('array')
    expect(possibleTileOrders).to.have.length(1)
    expect(possibleTileOrders).to.deep.equal([
      {
        splitArmy: false,
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 1, colIndex: 0 },
      }
    ])
    const otherTile = gameConfiguration.revealed.grid[1][1]
    const possibleOtherTileOrders: Order[] = getNonsplittingTileOrders(gameInfo, otherTile)
    expect(possibleOtherTileOrders).to.be.an('array')
    expect(possibleOtherTileOrders).to.have.length(0)
  })
})