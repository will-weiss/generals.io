import { expect } from 'chai'
import { sampleFirstTurnVisibleGameInformation, sampleSecondTurnVisibleGameInformation }  from '../sampleVisibleGameInformation'
import { getPossibleOrders, getNonsplittingTileOrders, stepAway, marchAway } from './index'
import { Order, GameState,  } from '../types'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'


describe('getPossibleOrders', () => {
  it('returns an array of possble orders given the game state and game configuration', () => {
    const config: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
    const state: GameState = createGameState(config, sampleFirstTurnVisibleGameInformation)
    const gameInformation: Complete
    const possibleOrders: Order[] = getPossibleOrders(gameInformation)
    expect(possibleOrders).to.be.an('array')
    expect(possibleOrders).to.have.length(2)
    expect(possibleOrders).to.deep.equal([
      {
        splitArmy: false,
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 1, colIndex: 0 },
      },
      {
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 1, colIndex: 0 },
        splitArmy: true
      }
    ])
  })
})


describe('getNonsplittingTileOrders', () => {
  it('returns an array of possble orders given a specific tile, the game state, and game configuration', () => {
    const config: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
    const state: GameState = createGameState(config, sampleFirstTurnVisibleGameInformation)
    const tile = config.revealed.grid[0][0]
    const possibleTileOrders: Order[] = getNonsplittingTileOrders(config, state,tile)
    expect(possibleTileOrders).to.be.an('array')
    expect(possibleTileOrders).to.have.length(1)
    expect(possibleTileOrders).to.deep.equal([
      {
        splitArmy: false,
        from: { rowIndex: 0, colIndex: 0 },
        to: { rowIndex: 1, colIndex: 0 },
      }
    ])
    const otherTile = config.revealed.grid[1][1]
    const possibleOtherTileOrders: Order[] = getNonsplittingTileOrders(config, state, otherTile)
    expect(possibleOtherTileOrders).to.be.an('array')
    expect(possibleOtherTileOrders).to.have.length(0)
  })
})

describe('stepAway', () => {
  it('returns an order for a tile given state, config, the specified tile, and an origin tile', () =>{
    const config: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
    const state: GameState = createGameState(config, sampleFirstTurnVisibleGameInformation)
    const originTile = config.revealed.grid[0][0]
    const otherTile = config.revealed.grid[0][1]
    const marchOrder = stepAway(config, state, originTile, originTile)
    const emptyMarchOrder = stepAway(config,state, originTile, otherTile)
    expect(marchOrder).to.deep.equal({splitArmy: false, from: { rowIndex: 0, colIndex: 0 }, to: { rowIndex: 1, colIndex: 0 }})
  })
})


// describe('marchAway', () => {
//   it('returns a series of orders given state, config, a first tile and a tile to run away from', () => {
//     const config: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
//     const state: GameState = createGameState(config, sampleFirstTurnVisibleGameInformation)
//     const originTile = config.revealed.grid[0][0]
//     const tile = config.revealed.grid[0][2]

//     const ordersIssued = Array.from(marchAway(config, state, originTile, tile))

//     expect(ordersIssued).to.deep.equal([])

//   })
// })