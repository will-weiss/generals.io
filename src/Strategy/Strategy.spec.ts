import { expect } from 'chai'
import sampleFirstTurnVisibleGameInformation from '../sampleFirstTurnVisibleGameInformation'
import { getPossibleOrders } from './index'
import { Order, GameState } from '../types'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'


describe('getPossibleOrders', () => {
  it('returns an array of possble orders given the game state and game configuration', () => {
    const gameConfiguration: GameConfiguration = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)
    const gameState: GameState = createGameState(gameConfiguration, sampleFirstTurnVisibleGameInformation)
    const possibleOrders: Order[] = getPossibleOrders(gameConfiguration, gameState)
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
