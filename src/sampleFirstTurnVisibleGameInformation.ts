import deepFreeze = require('deep-freeze')
import { VisibleGameInformation } from './types'


const sampleFirstTurnVisibleGameInformation: VisibleGameInformation = {
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

export default deepFreeze(sampleFirstTurnVisibleGameInformation) as VisibleGameInformation
