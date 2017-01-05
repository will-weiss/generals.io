import deepFreeze = require('deep-freeze')
import { expect } from 'chai'
import { flatten, max, range } from 'lodash'
import { Tile, RevealedGameConfiguration, VisibleGameInformation } from '../types'


function createGrid(height: number, width: number): Tile[][] {
  const rowIndexes = range(height)
  const colIndexes = range(width)
  return rowIndexes.map(rowIndex => colIndexes.map(colIndex => ({ rowIndex, colIndex })))
}

export default function createRevealedGameConfiguration(
  myName: string,
  firstVisibleState: VisibleGameInformation
): RevealedGameConfiguration {

  // For now it seems we're not fast enough to assert this...
  // expect(firstVisibleState).to.have.property('turn').that.equals(0)

  const playerColors = firstVisibleState.leaderboard.map(row => row.color)
  const myLeaderboardRow = firstVisibleState.leaderboard.find(row => row.name === myName)

  if (!myLeaderboardRow) throw new Error(`No row in leaderboard with name ${myName}`)
  const myColor = myLeaderboardRow.color

  const height = 1 + max(firstVisibleState.tiles.map(tile => tile.rowIndex))
  const width = 1 + max(firstVisibleState.tiles.map(tile => tile.colIndex))

  const grid: Tile[][] = createGrid(height, width)
  const tiles: Set<Tile> = new Set(flatten(grid))

  const myVisibleCrown = firstVisibleState.tiles.find(visibleTile => visibleTile.isGeneral && (visibleTile.color === myColor))

  if (!myVisibleCrown) throw new Error(`Could not find general tile`)

  const myCrown: Tile = grid[myVisibleCrown.rowIndex][myVisibleCrown.colIndex]

  return { playerColors, height, width, myColor, myCrown, grid, tiles }
}
