import { Tile } from '../types'

export const ffa = '#game-modes > center > button.inverted:first-of-type'
export const oneVsOne = '#game-modes > center > button.inverted:first-of-type ~ button'
export const loadMore = '#replays-table-container > button'
export const exitReplays = '#replays > button.small.inverted.center-horizontal'
export const replays = '#replays'
export const replayList = '#replaylist-button'
export const watchReplay = '.alert > center > button.small.inverted'
export const exitGame = '.alert > center > button.inverted:last-of-type'
export const playGame = 'button.big'
export const turnCounter = '#turn-counter'
export const mainMenu = '#main-menu'
export const gameModes = '#game-modes'
export const replayLink = '#replays-table > tbody > tr > td > a'
export const nameInput = 'input[placeholder="Anonymous"]'

export function ofTile(tile: Tile): string {
  return `#map > tbody > tr:nth-child(${tile.rowIndex + 1}) > td:nth-child(${tile.colIndex + 1})`
}

export function ofOrderArrow(tile: Tile): string {
  return `${ofTile(tile)} > div[class*="center-"]`
}

