import { expect } from 'chai'
import { VisibleGameInformation } from '../types'
import GameConfiguration from './index'


describe('GameConfiguration', () => {
  const firstVisibleGameState: VisibleGameInformation = {
    turn: 0,
    game: { over: false, victorious: false },
    leaderboard: [
      { army: 151, name: 'Anonymous', land: 1, color: 'red' },
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

  const config = new GameConfiguration('Anonymous', firstVisibleGameState)

  it('adds the right properties', () => {
    expect(config.revealed.playerColors).to.deep.equal(['red', 'blue'])
    expect(config.revealed.height).to.deep.equal(2)
    expect(config.revealed.width).to.deep.equal(3)
    expect(config.revealed.myColor).to.deep.equal('red')
    expect(config.revealed.myCrown).to.deep.equal({ rowIndex: 0, colIndex: 0 })
    expect(config.revealed.grid).to.be.an('array').that.has.length(2)
    expect(config.revealed.tiles).to.be.an.instanceOf(Set)
    expect(config.hidden.passable).to.be.an.instanceOf(Set)
    expect(config.hidden.adjacencies).to.be.an.instanceOf(Map)
    expect(config.hidden.distances).to.be.an.instanceOf(Map)
  })

  it('calculates a distance of Infinity to/from mountain tiles', () => {
    const mountain = config.revealed.grid[0][1]
    expect(config.hidden.passable.has(mountain)).to.be.false
    const distancesFromMountain = config.hidden.distances.get(mountain)!
    expect(distancesFromMountain.size).to.equal(config.revealed.tiles.size)
    for (const distance of distancesFromMountain.values()) { expect(distance).to.equal(Infinity) }
    for (const distancesFromTile of config.hidden.distances.values()) { expect(distancesFromTile.get(mountain)).to.equal(Infinity) }
  })

  it('calculates distances correctly for passable tiles', () => {
    const tile0_0 = config.revealed.grid[0][0]
    const tile1_0 = config.revealed.grid[1][0]
    const tile1_1 = config.revealed.grid[1][1]
    const tile1_2 = config.revealed.grid[1][2]
    const tile0_2 = config.revealed.grid[0][2]
    expect(config.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
    expect(config.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
    expect(config.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
    expect(config.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
    expect(config.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(4)
  })

  describe('update', () => {
    it('update distances given new visible gamestate', () => {
      const firstVisibleGameState: VisibleGameInformation = {
        turn: 0,
        game: { over: false, victorious: false },
        leaderboard: [
          { army: 151, name: 'Anonymous', land: 1, color: 'red' },
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
          { army: 151, name: 'Anonymous', land: 1, color: 'red' },
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

      const config = new GameConfiguration('Anonymous', firstVisibleGameState)

      const tile0_0 = config.revealed.grid[0][0]
      const tile0_1 = config.revealed.grid[0][1]
      const tile0_2 = config.revealed.grid[0][2]
      const tile1_0 = config.revealed.grid[1][0]
      const tile1_1 = config.revealed.grid[1][1]
      const tile1_2 = config.revealed.grid[1][2]

      expect(config.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
      expect(config.hidden.distances.get(tile0_0)!.get(tile0_1)).to.equal(undefined)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
      expect(config.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(4)

      config.update(newVisibleGameState)

      expect(config.hidden.distances.get(tile0_0)!.get(tile0_0)).to.equal(0)
      expect(config.hidden.distances.get(tile0_0)!.get(tile0_1)).to.equal(1)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_0)).to.equal(1)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_1)).to.equal(2)
      expect(config.hidden.distances.get(tile0_0)!.get(tile1_2)).to.equal(3)
      expect(config.hidden.distances.get(tile0_0)!.get(tile0_2)).to.equal(2)

    })
  })
})
