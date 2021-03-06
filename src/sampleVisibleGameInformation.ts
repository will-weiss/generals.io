import deepFreeze = require('deep-freeze')
import { VisibleGameInformation } from './types'


export const sampleFirstTurnVisibleGameInformation: VisibleGameInformation = deepFreeze({
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
})

export const sampleSecondTurnVisibleGameInformation: VisibleGameInformation = deepFreeze({
  turn: 0,
  game: { over: false, victorious: false },
  leaderboard: [
    { army: 151, name: 'dookiebot', land: 1, color: 'red' },
    { army: 2, name: 'generals.io Tutorial', land: 9, color: 'blue' }
  ],
  tiles: [
    { army: 1, isKnownMountain: false, color: 'red', isCity: true,  isGeneral: true,  colIndex: 0, rowIndex: 0, isVisible: true  },
    { army: 0,  isKnownMountain: true,  color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 0, isVisible: true },
    { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 0, isVisible: false },
    { army: 50,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 0, rowIndex: 1, isVisible: true },
    { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 1, rowIndex: 1, isVisible: true },
    { army: 0,  isKnownMountain: false, color: null,  isCity: false, isGeneral: false, colIndex: 2, rowIndex: 1, isVisible: false },
  ],
})
