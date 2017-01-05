import { expect } from 'chai'
import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import { VisibleGameInformation } from '../types'


describe('createRevealedGameConfiguration', () => {
  const firstVisibleGameState: VisibleGameInformation = {
    turn: 0,
    game: { over: false, victorious: false },
    leaderboard: [
      { army: 151, name: 'Anonymous', land: 1, color: 'red' },
      { army: 2, name: 'generals.io Tutorial', land: 9, color: 'blue' }
    ],
    tiles: [
      { army: 50, isMountain: false, color: 'red', isCity: true,  isGeneral: true,  colIndex: 0, rowIndex: 0, isVisible: true  },
      { army: 0,  isMountain: true,  color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 0, isVisible: false },
      { army: 0,  isMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 0, isVisible: false },
      { army: 0,  isMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 0, rowIndex: 1, isVisible: false },
      { army: 0,  isMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 1, isVisible: false },
      { army: 0,  isMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 1, isVisible: false },
    ],
  }

  const revealedGameConfiguration = createRevealedGameConfiguration('Anonymous', firstVisibleGameState)

  it('adds the right properties', () => {
    expect(revealedGameConfiguration.playerColors).to.deep.equal(['red', 'blue'])
    expect(revealedGameConfiguration.height).to.deep.equal(2)
    expect(revealedGameConfiguration.width).to.deep.equal(3)
    expect(revealedGameConfiguration.myColor).to.deep.equal('red')
    expect(revealedGameConfiguration.myCrown).to.deep.equal({ rowIndex: 0, colIndex: 0 })
    expect(revealedGameConfiguration.grid).to.be.an('array').that.has.length(2)
    expect(revealedGameConfiguration.tiles).to.be.an.instanceOf(Set)
  })
})
