import { expect } from 'chai'
import { sampleFirstTurnVisibleGameInformation, sampleSecondTurnVisibleGameInformation }  from '../sampleVisibleGameInformation'
import { getNonsplittingTileOrders, stepAway } from './wip'
import { Order, GameState } from '../types'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'


describe('getNonsplittingTileOrders', () => {
  it('returns an array of possble orders given a specific tile, the game state, and game configuration', () => {
    const gameConfiguration: GameConfiguration = new GameConfiguration('dookiebot', sampleFirstTurnVisibleGameInformation)
    const gameState: GameState = createGameState(gameConfiguration, sampleFirstTurnVisibleGameInformation)
    const tile = gameConfiguration.revealed.grid[0][0]
    const possibleTileOrders: Order[] = getNonsplittingTileOrders(gameConfiguration, gameState,tile)
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
    const possibleOtherTileOrders: Order[] = getNonsplittingTileOrders(gameConfiguration, gameState, otherTile)
    expect(possibleOtherTileOrders).to.be.an('array')
    expect(possibleOtherTileOrders).to.have.length(0)
  })
})

describe('stepAway', () => {
  it('returns an order for a tile given gameState, gameConfiguration, the specified tile, and an origin tile', () =>{
    const gameConfiguration: GameConfiguration = new GameConfiguration('dookiebot', sampleFirstTurnVisibleGameInformation)
    const gameState: GameState = createGameState(gameConfiguration, sampleFirstTurnVisibleGameInformation)
    const originTile = gameConfiguration.revealed.grid[0][0]
    const otherTile = gameConfiguration.revealed.grid[0][1]
    const marchOrder = stepAway(gameConfiguration, gameState, originTile, originTile)
    const emptyMarchOrder = stepAway(gameConfiguration,gameState, originTile, otherTile)
    expect(marchOrder).to.deep.equal({splitArmy: false, from: { rowIndex: 0, colIndex: 0 }, to: { rowIndex: 1, colIndex: 0 }})


  })
})