import { expect } from 'chai'
import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import { VisibleGameInformation } from '../types'


describe('createRevealedGameConfiguration', () => {
  const firstVisibleGameState: VisibleGameInformation = {
    turn: 0,
    game: { over: false, victorious: false },
    leaderboard: [
      { army: 151, name: 'dookiebot', land: 1, color: 'red' },
      { army: 2, name: 'generals.io Tutorial', land: 9, color: 'blue' }
    ],
    tiles: [
      { army: 50, isKnownMountain: false, color: 'red', isCity: true,  isGeneral: true,  colIndex: 0, rowIndex: 0, isVisible: true  },
      { army: 0,  isKnownMountain: true,  color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 0, isVisible: false },
      { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 0, isVisible: false },
      { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 0, rowIndex: 1, isVisible: false },
      { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 1, isVisible: false },
      { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 1, isVisible: false },
    ],
  }

  const revealedGameConfiguration = createRevealedGameConfiguration('dookiebot', firstVisibleGameState)

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
