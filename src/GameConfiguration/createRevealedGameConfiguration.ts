import deepFreeze = require('deep-freeze')
import { expect } from 'chai'
import { flatten, max, range } from 'lodash'
import { Tile, RevealedGameConfiguration, VisibleGameState } from '../types'


function createGrid(height: number, width: number): Tile[][] {
  const rowIndexes = range(height)
  const colIndexes = range(width)
  return rowIndexes.map(rowIndex => colIndexes.map(colIndex => ({ rowIndex, colIndex })))
}

export default function createRevealedGameConfiguration(myName: string, firstVisibleState: VisibleGameState): RevealedGameConfiguration {

  expect(firstVisibleState).to.have.property('turn').that.equals(0)

  const playerColors = firstVisibleState.leaderboard.map(row => row.color)
  const myLeaderboardRow = firstVisibleState.leaderboard.find(row => row.name === myName)

  if (!myLeaderboardRow) throw new Error(`No row in leaderboard with name ${myName}`)
  const myColor = myLeaderboardRow.color

  const height = 1 + max(firstVisibleState.tiles.map(tile => tile.rowIndex))
  const width = 1 + max(firstVisibleState.tiles.map(tile => tile.colIndex))

  const grid: Tile[][] = createGrid(height, width)
  const tiles: Set<Tile> = new Set(flatten(grid))

  const visibleMountainTiles = firstVisibleState.tiles.filter(visibleTile => visibleTile.isMountain)
  const myVisibleCrown = firstVisibleState.tiles.find(visibleTile => visibleTile.isGeneral && (visibleTile.color === myColor))

  if (!myVisibleCrown) throw new Error(`Could not find general tile`)

  const myCrown: Tile = grid[myVisibleCrown.rowIndex][myVisibleCrown.colIndex]

  const passable: Set<Tile> = new Set()
  const adjacencies: Map<Tile, Set<Tile>> = new Map()
  const distances: Map<Tile, Map<Tile, number>> = new Map()

  function isPassable(tile: Tile): boolean {
    return visibleMountainTiles.some(visibleMountain =>
      tile.rowIndex === visibleMountain.rowIndex && tile.colIndex === visibleMountain.colIndex)
  }

  function tileAt(rowIndex: number, colIndex: number): Tile | undefined {
    const row = grid[rowIndex]
    return row && row[colIndex]
  }

  tiles.forEach(tile => { if (!isPassable(tile)) passable.add(tile) })
  tiles.forEach(tile => adjacencies.set(tile, new Set()))
  tiles.forEach(tile => distances.set(tile, new Map()))
  tiles.forEach(from => tiles.forEach(to => distances.get(from)!.set(to, Infinity)))

  passable.forEach(tile => {
    distances.get(tile)!.set(tile, 0)
    const { rowIndex, colIndex } = tile
    const north = tileAt(rowIndex - 1, colIndex)
    const south = tileAt(rowIndex + 1, colIndex)
    const west  = tileAt(rowIndex, colIndex - 1)
    const east  = tileAt(rowIndex, colIndex + 1)
    if (north && passable.has(tile)) adjacencies.get(tile)!.add(north)
    if (south && passable.has(tile)) adjacencies.get(tile)!.add(south)
    if (west && passable.has(tile))  adjacencies.get(tile)!.add(west)
    if (east && passable.has(tile))  adjacencies.get(tile)!.add(east)
  })

  function walk(): void {
    let anyUpdated = false

    for (const tile of passable) {
      for (const adjacency of adjacencies.get(tile)!) {
        for (const [otherTile, adjacencyDistance] of distances.get(adjacency)!.entries()) {
          const possiblySmallerDistance = adjacencyDistance + 1
          const currentDistance = distances.get(tile)!.get(otherTile)
          const performUpdate = possiblySmallerDistance < currentDistance
          anyUpdated = anyUpdated || performUpdate
          if (performUpdate) distances.get(tile)!.set(otherTile, possiblySmallerDistance)
        }
      }
    }

    if (anyUpdated) return walk()
  }

  walk()

  return deepFreeze({ playerColors, height, width, myColor, myCrown, grid, tiles, passable, adjacencies, distances })
}
