import deepFreeze = require('deep-freeze')
import { VisibleGameState } from './types'


const firstVisibleGameState: VisibleGameState = {
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

export default deepFreeze(firstVisibleGameState) as VisibleGameState
