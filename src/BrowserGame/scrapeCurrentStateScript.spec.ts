import { expect } from 'chai'
import { readFileSync } from 'fs'
import { jsdom } from 'jsdom'
import scrapeCurrentStateScript from './scrapeCurrentStateScript'


describe('scrapeCurrentStateScript', () => {

  const html = readFileSync(__dirname + '/example.html', 'utf8')
  let window: Window & { scrapeCurrentState: Function }

  beforeEach(() => {
    window = jsdom(html).defaultView as any
    scrapeCurrentStateScript.call(window)
  })

  it('adds a scrapeCurrentState function to the window', () => {
    expect(window).to.have.property('scrapeCurrentState').that.is.a('function')
  })

  describe('scrapeCurrentState', () => {
    it('scrapes the current state of the game', () => {
      const currentState = window.scrapeCurrentState()
      expect(currentState).to.deep.equal({
        game: { over: false, victorious: false },
        turn: 55,
        leaderboard: [
          { name: 'Anonymous', color: 'red', army: 216, land: 6 },
          { name: 'generals.io Tutorial', color: 'blue', army: 74, land: 9 },
        ],
        tiles: [
          { rowIndex: 0, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 3, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 4, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 5, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 0, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 3, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 6, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 1, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 2, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 3, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: false, isCity: false, army: 4 },
          { rowIndex: 2, colIndex: 6, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 2, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 2, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 3, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: false, isCity: false, army: 76 },
          { rowIndex: 3, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: false, isCity: false, army: 3 },
          { rowIndex: 3, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: true, isCity: true, army: 55 },
          { rowIndex: 3, colIndex: 6, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'grey', isGeneral: false, isCity: true, army: 50 },
          { rowIndex: 3, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 3, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 2, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 3, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: false, isCity: false, army: 2 },
          { rowIndex: 4, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 6, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 4, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 3, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'red', isGeneral: false, isCity: false, army: 76 },
          { rowIndex: 5, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: true, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 5, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 3, isUnknownObstacle: false, isVisible: true, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 4, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'blue', isGeneral: false, isCity: false, army: 2 },
          { rowIndex: 6, colIndex: 5, isUnknownObstacle: false, isVisible: true, isMountain: false, color: 'blue', isGeneral: true, isCity: true, army: 58 },
          { rowIndex: 6, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 6, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 3, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 4, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 5, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 7, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 3, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 4, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 5, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 8, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 0, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 1, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 2, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 3, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 4, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 5, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 6, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 7, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 8, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
          { rowIndex: 9, colIndex: 9, isUnknownObstacle: false, isVisible: false, isMountain: false, color: null, isGeneral: false, isCity: false, army: 0 },
        ],
      })
    })
  })
})
