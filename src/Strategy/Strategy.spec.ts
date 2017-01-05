import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { stub, SinonStub } from 'sinon'
import { EventEmitter } from 'events'
import firstVisibleGameState from '../sampleVisibleState'
import { getPossibleOrders } from './index'
import { Tile, Order, GameState } from '../types'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'


describe('getPossibleOrders', () => {
  it('returns an array of possble orders given the game state and game configuration', () => {
    const gameConfiguration: GameConfiguration = new GameConfiguration('Anonymous', firstVisibleGameState)
    const gameState: GameState = createGameState(gameConfiguration, firstVisibleGameState)
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
