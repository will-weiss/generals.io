import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import { Tile, HiddenGameConfiguration, VisibleGameInformation, RevealedGameConfiguration, LivePlayerColor } from '../types'


function createHiddenGameConfiguration(revealed: RevealedGameConfiguration, firstVisibleState: VisibleGameInformation): HiddenGameConfiguration {

  // For now it seems we're not fast enough to assert this...
  // expect(firstVisibleState).to.have.property('turn').that.equals(0)

  const { grid, tiles } = revealed
  const visibleMountainTiles = firstVisibleState.tiles.filter(visibleTile => visibleTile.isKnownMountain)

  const passable: Set<Tile> = new Set()
  const adjacencies: Map<Tile, Set<Tile>> = new Map()
  const distances: Map<Tile, Map<Tile, number>> = new Map()

  function isPassable(tile: Tile): boolean {
    return !visibleMountainTiles.some(visibleMountain =>
      tile.rowIndex === visibleMountain.rowIndex && tile.colIndex === visibleMountain.colIndex)
  }

  function tileAt(rowIndex: number, colIndex: number): Tile | undefined {
    const row = grid[rowIndex]
    return row && row[colIndex]
  }

  tiles.forEach(tile => { if (isPassable(tile)) passable.add(tile) })
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
    if (north && passable.has(north)) adjacencies.get(tile)!.add(north)
    if (south && passable.has(south)) adjacencies.get(tile)!.add(south)
    if (west  && passable.has(west))  adjacencies.get(tile)!.add(west)
    if (east  && passable.has(east))  adjacencies.get(tile)!.add(east)
  })

  function walk(): void {
    let anyUpdated = false

    for (const tile of passable) {
      for (const adjacency of adjacencies.get(tile)!) {
        for (const [otherTile, adjacencyDistance] of distances.get(adjacency)!.entries()) {
          const possiblySmallerDistance = adjacencyDistance + 1
          const currentDistance = distances.get(tile)!.get(otherTile)
          const performUpdate = possiblySmallerDistance < currentDistance
          if (performUpdate) {
            distances.get(tile)!.set(otherTile, possiblySmallerDistance)
            anyUpdated = true
          }
        }
      }
    }

    if (anyUpdated) return walk()
  }

  walk()

  return { passable, adjacencies, distances, cities: new Set(), crowns: new Map() }
}


export default class GameConfiguration implements GameConfiguration {
  revealed: RevealedGameConfiguration
  hidden: HiddenGameConfiguration

  constructor(myName: string, firstVisibleState: VisibleGameInformation) {
    this.revealed = createRevealedGameConfiguration(myName, firstVisibleState)
    this.hidden = createHiddenGameConfiguration(this.revealed, firstVisibleState)
    this.update(firstVisibleState)
  }

  update(visibleGameState: VisibleGameInformation): this {
    
    visibleGameState.tiles.forEach(visibleTile => {
      if (!visibleTile.isCity) return
      const tile = this.revealed.grid[visibleTile.rowIndex][visibleTile.colIndex]
      this.hidden.cities.add(tile)
      if (visibleTile.isGeneral) this.hidden.crowns.set(visibleTile.color as LivePlayerColor, tile)
    })



    return this
  }
}
