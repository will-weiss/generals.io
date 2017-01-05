import { expect } from 'chai'
import createRevealedGameConfiguration from '../GameConfiguration/createRevealedGameConfiguration'
import createGameState from './index'
import sampleFirstTurnVisibleGameInformation from '../sampleFirstTurnVisibleGameInformation'
import { VisibleGameInformation, GameConfiguration } from '../types'

describe('createGameState', () => {
  it("computes the current game state given the game's configuration, the currently visible state, and the previous game state", () => {
    const revealedGameConfiguration = createRevealedGameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)

    const config: GameConfiguration = {
      hidden: { cities: new Set(), crowns: new Map() },
      revealed: revealedGameConfiguration
    }

    const gameState = createGameState(config, sampleFirstTurnVisibleGameInformation)

    expect(gameState).to.have.all.keys('turn', 'gameOver', 'victorious', 'leaderboard', 'armies', 'pastState')

    expect(gameState.turn).to.equal(0)
    expect(gameState.gameOver).to.be.false
    expect(gameState.victorious).to.be.false
    expect(gameState.leaderboard).to.be.an.instanceOf(Map)
    expect(gameState.armies).to.be.an.instanceOf(Map)
    expect(gameState.pastState).to.equal(undefined)

    expect(gameState.leaderboard.get('red')).to.deep.equal({ alive: true, army: 151, land: 1 })
    expect(gameState.leaderboard.get('blue')).to.deep.equal({ alive: true, army: 2, land: 9 })

    expect(gameState.armies.get('grey')!.size).to.equal(0)
    expect(gameState.armies.get('blue')!.size).to.equal(0)
    expect(gameState.armies.get('red')!.size).to.equal(1)
    expect(gameState.armies.get('red')!.get(config.revealed.grid[0][0])).to.equal(50)
  })
})
