import { expect } from 'chai'
import GameConfiguration from '../GameConfiguration'
import createGameState from './index'
import { sampleFirstTurnVisibleGameInformation } from '../sampleVisibleGameInformation'


describe('createGameState', () => {
  it("computes the current game state given the game's configuration, the currently visible state, and the previous game state", () => {
    const config = new GameConfiguration('Anonymous', sampleFirstTurnVisibleGameInformation)

    const state = createGameState(config, sampleFirstTurnVisibleGameInformation)

    expect(state).to.have.all.keys('turn', 'gameOver', 'victorious', 'leaderboard', 'armies', 'pastState')

    expect(state.turn).to.equal(0)
    expect(state.gameOver).to.be.false
    expect(state.victorious).to.be.false
    expect(state.leaderboard).to.be.an.instanceOf(Map)
    expect(state.armies).to.be.an.instanceOf(Map)
    expect(state.pastState).to.equal(undefined)

    expect(state.leaderboard.get('red')).to.deep.equal({ alive: true, army: 151, land: 1 })
    expect(state.leaderboard.get('blue')).to.deep.equal({ alive: true, army: 2, land: 9 })

    expect(state.armies.get('grey')!.size).to.equal(0)
    expect(state.armies.get('blue')!.size).to.equal(0)
    expect(state.armies.get('red')!.size).to.equal(1)
    expect(state.armies.get('red')!.get(config.revealed.grid[0][0])).to.equal(50)
  })
})
