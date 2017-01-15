import { expect } from 'chai'
import { VisibleGameInformation } from '../types'
import GameConfiguration from './index'


describe('GameConfiguration', () => {
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

  const gameConfiguration = new GameConfiguration('dookiebot', firstVisibleGameState)

  it('adds the right properties', () => {
    expect(gameConfiguration.revealed.playerColors).to.deep.equal(['red', 'blue'])
    expect(gameConfiguration.revealed.height).to.deep.equal(2)
    expect(gameConfiguration.revealed.width).to.deep.equal(3)
    expect(gameConfiguration.revealed.myColor).to.deep.equal('red')
    expect(gameConfiguration.revealed.myCrown).to.deep.equal({ rowIndex: 0, colIndex: 0 })
    expect(gameConfiguration.revealed.grid).to.be.an('array').that.has.length(2)
    expect(gameConfiguration.revealed.tiles).to.be.an.instanceOf(Set)
    expect(gameConfiguration.hidden.passable).to.be.an.instanceOf(Set)
    expect(gameConfiguration.hidden.adjacencies).to.be.an.instanceOf(Map)
    expect(gameConfiguration.hidden.distances).to.be.an.instanceOf(Map)
  })

  it('calculates a distance of Infinity to/from mountain tiles', () => {
    const mountain = gameConfiguration.revealed.grid[0][1]
    expect(gameConfiguration.hidden.passable.has(mountain)).to.be.false
    const distancesFromMountain = gameConfiguration.hidden.distances.get(mountain)!
    expect(distancesFromMountain.size).to.equal(gameConfiguration.revealed.tiles.size)
    for (const distance of distancesFromMountain.values()) { expect(distance).to.equal(Infinity) }
    for (const distancesFromTile of gameConfiguration.hidden.distances.values()) { expect(distancesFromTile.get(mountain)).to.equal(Infinity) }
  })

  it('calculates distances correctly for passable tiles', () => {
    const tile0_0 = gameConfiguration.revealed.grid[0][0]
    const tile1_0 = gameConfiguration.revealed.grid[1][0]
    const tile1_1 = gameConfiguration.revealed.grid[1][1]
    const tile1_2 = gameConfiguration.revealed.grid[1][2]
    const tile0_2 = gameConfiguration.revealed.grid[0][2]
    expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
    expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
    expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
    expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
    expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(4)
  })

  describe('update', () => {
    it('update distances given new visible gamestate', () => {
      const firstVisibleGameState: VisibleGameInformation = {
        turn: 0,
        game: { over: false, victorious: false },
        leaderboard: [
          { army: 151, name: 'dookiebot', land: 1, color: 'red' },
          { army: 2, name: 'generals.io Tutorial', land: 9, color: 'blue' }
        ],
        tiles: [
          { army: 50, isKnownMountain: false, color: 'red', isCity: true,  isGeneral: true,  colIndex: 0, rowIndex: 0, isVisible: true,  isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 0, isVisible: false, isUnknownObstacle: true  },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 0, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 0, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
        ],
      }
      
      const newVisibleGameState: VisibleGameInformation = {
        turn: 1,
        game: { over: false, victorious: false },
        leaderboard: [
          { army: 151, name: 'dookiebot', land: 1, color: 'red' },
          { army: 2, name: 'generals.io Tutorial', land: 9, color: 'blue' }
        ],
        tiles: [
          { army: 50, isKnownMountain: false, color: 'red', isCity: true,  isGeneral: true,  colIndex: 0, rowIndex: 0, isVisible: true,  isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 0, isVisible: false, isUnknownObstacle: false  },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 0, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 0, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
          { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 1, isVisible: false, isUnknownObstacle: false },
        ],
      }

      const gameConfiguration = new GameConfiguration('dookiebot', firstVisibleGameState)

      const tile0_0 = gameConfiguration.revealed.grid[0][0]
      const tile0_1 = gameConfiguration.revealed.grid[0][1]
      const tile0_2 = gameConfiguration.revealed.grid[0][2]
      const tile1_0 = gameConfiguration.revealed.grid[1][0]
      const tile1_1 = gameConfiguration.revealed.grid[1][1]
      const tile1_2 = gameConfiguration.revealed.grid[1][2]

      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_1)).to.equal(undefined)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(4)

      gameConfiguration.update(newVisibleGameState)

      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_1)).to.equal(1)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
      expect(gameConfiguration.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(2)

    })
  })
})
