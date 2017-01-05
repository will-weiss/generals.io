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
    expect(revealedGameConfiguration.passable).to.be.an.instanceOf(Set)
    expect(revealedGameConfiguration.adjacencies).to.be.an.instanceOf(Map)
    expect(revealedGameConfiguration.distances).to.be.an.instanceOf(Map)
  })

  it('calculates a distance of Infinity to/from mountain tiles', () => {
    const mountain = revealedGameConfiguration.grid[0][1]
    expect(revealedGameConfiguration.passable.has(mountain)).to.be.false
    const distancesFromMountain = revealedGameConfiguration.distances.get(mountain)!
    expect(distancesFromMountain.size).to.equal(revealedGameConfiguration.tiles.size)
    for (const distance of distancesFromMountain.values()) { expect(distance).to.equal(Infinity) }
    for (const distancesFromTile of revealedGameConfiguration.distances.values()) { expect(distancesFromTile.get(mountain)).to.equal(Infinity) }
  })

  it('calculates distances correctly for passable tiles', () => {
    const tile0_0 = revealedGameConfiguration.grid[0][0]
    const tile1_0 = revealedGameConfiguration.grid[1][0]
    const tile1_1 = revealedGameConfiguration.grid[1][1]
    const tile1_2 = revealedGameConfiguration.grid[1][2]
    const tile0_2 = revealedGameConfiguration.grid[0][2]
    expect(revealedGameConfiguration.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
    expect(revealedGameConfiguration.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
    expect(revealedGameConfiguration.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
    expect(revealedGameConfiguration.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
    expect(revealedGameConfiguration.distances.get(tile0_0)!.get(tile0_2)).to.equal(4)
  })
})
