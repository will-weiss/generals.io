import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import { Tile, HiddenGameConfiguration, VisibleGameInformation, RevealedGameConfiguration, LivePlayerColor } from '../types'
import { expect } from 'chai'


function createHiddenGameConfiguration(revealed: RevealedGameConfiguration, firstVisibleState: VisibleGameInformation): HiddenGameConfiguration {

  // For now it seems we're not fast enough to assert this...
  // expect(firstVisibleState).to.have.property('turn').that.equals(0)

  const { grid, tiles } = revealed
  const knownMountainTiles = firstVisibleState.tiles.filter(visibleTile => visibleTile.isKnownMountain)
  const unknownObstacleTiles = firstVisibleState.tiles.filter(visibleTile => visibleTile.isUnknownObstacle)


  const passable: Set<Tile> = new Set()
  const unknownObstacles: Set<Tile> = new Set()
  const adjacencies: Map<Tile, Set<Tile>> = new Map()
  const distances: Map<Tile, Map<Tile, number>> = new Map()
  
  function isKnownMountain(tile:Tile): boolean {
    return knownMountainTiles.some(knownMountainTile =>
      tile.rowIndex === knownMountainTile.rowIndex && tile.colIndex === knownMountainTile.colIndex)
  }

  function isUnknownObstacle(tile:Tile): boolean {
    return unknownObstacleTiles.some(unknownObstacleTile =>
      tile.rowIndex === unknownObstacleTile.rowIndex && tile.colIndex === unknownObstacleTile.colIndex)
  }

  function isKnownPassable(tile: Tile): boolean {
    return !isKnownMountain(tile) && !isUnknownObstacle(tile)
  }

  function tileAt(rowIndex: number, colIndex: number): Tile | undefined {
    const row = grid[rowIndex]
    return row && row[colIndex]
  }

  tiles.forEach(tile => { if (isKnownPassable(tile)) passable.add(tile) })
  tiles.forEach(tile => { if (isUnknownObstacle(tile)) unknownObstacles.add(tile) })
  tiles.forEach(tile => adjacencies.set(tile, new Set()))
  tiles.forEach(tile => distances.set(tile, new Map()))
  tiles.forEach(from => tiles.forEach(to => distances.get(from)!.set(to, Infinity)))

  function maybeAddAdjacency(tile: Tile, otherTile: Tile | undefined): void {
    if (otherTile && passable.has(otherTile)) {
      adjacencies.get(tile)!.add(otherTile)
      adjacencies.get(otherTile)!.add(tile)
    }
  }

  passable.forEach(tile => {
    distances.get(tile)!.set(tile, 0)
    const { rowIndex, colIndex } = tile
    const north = tileAt(rowIndex - 1, colIndex)
    const south = tileAt(rowIndex + 1, colIndex)
    const west  = tileAt(rowIndex, colIndex - 1)
    const east  = tileAt(rowIndex, colIndex + 1)
    maybeAddAdjacency(tile, north)
    maybeAddAdjacency(tile, south)
    maybeAddAdjacency(tile, west)
    maybeAddAdjacency(tile, east)
  })

  unknownObstacles.forEach(tile => {
    tiles.forEach(otherTile => {
      distances.get(tile)!.set(otherTile, undefined)
      distances.get(otherTile)!.set(tile, undefined)
    })
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

  return { passable, unknownObstacles, adjacencies, distances, cities: new Set(), crowns: new Map() }
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
    const { grid, tiles } = this.revealed
    const { passable, unknownObstacles, adjacencies, distances, cities, crowns } = this.hidden

    function tileAt(rowIndex: number, colIndex: number): Tile | undefined {
      const row = grid[rowIndex]
      return row && row[colIndex]
    }

    function maybeAddAdjacency(tile: Tile, otherTile: Tile | undefined): void {
      if (otherTile && passable.has(otherTile)) {
        adjacencies.get(tile)!.add(otherTile)
        adjacencies.get(otherTile)!.add(tile)
        distances.get(tile)!.set(otherTile, 1)
        distances.get(otherTile)!.set(tile, 1)
      }
    }

    function markTileAsPassable(tile: Tile): void {
      passable.add(tile)
      distances.get(tile)!.set(tile, 0)
      const { rowIndex, colIndex } = tile
      const north = tileAt(rowIndex - 1, colIndex)
      const south = tileAt(rowIndex + 1, colIndex)
      const west  = tileAt(rowIndex, colIndex - 1)
      const east  = tileAt(rowIndex, colIndex + 1)
      
      maybeAddAdjacency(tile, north)
      maybeAddAdjacency(tile, south)
      maybeAddAdjacency(tile, west)
      maybeAddAdjacency(tile, east)

      // update other distances which may now be shorter because of this new tile
      for (const firstTile of passable) {
        for (const secondTile of passable) {
          const oldDistance = distances.get(firstTile)!.get(secondTile)
          const firstLeg = distances.get(firstTile)!.get(tile)
          const secondLeg = distances.get(tile)!.get(secondTile)
          expect(firstLeg).to.be.a('number')
          expect(secondLeg).to.be.a('number')
          const possibleNewDistance = distances.get(firstTile)!.get(tile) + distances.get(tile)!.get(secondTile)
          if (possibleNewDistance < oldDistance) {
            distances.get(firstTile)!.set(secondTile, possibleNewDistance)
            distances.get(secondTile)!.set(firstTile, possibleNewDistance)
          }
        }

      }
    }

    function setNumericDistances(tile: Tile): void {
      tiles.forEach(otherTile => {
        distances.get(tile)!.set(otherTile, Infinity)
        distances.get(otherTile)!.set(tile, Infinity)
      })
    }

    visibleGameState.tiles.forEach(visibleTile => {
      if (!visibleTile.isCity) return
      const tile = grid[visibleTile.rowIndex][visibleTile.colIndex]
      cities.add(tile)
      if (visibleTile.isGeneral) crowns.set(visibleTile.color as LivePlayerColor, tile)
    })

    visibleGameState.tiles.forEach(visibleTile => {
      if (visibleTile.isUnknownObstacle) return
      const tile = grid[visibleTile.rowIndex][visibleTile.colIndex]
      const wasAlreadySeen = !unknownObstacles.has(tile)
      if (wasAlreadySeen) return
      unknownObstacles.delete(tile)
      setNumericDistances(tile)
      if (!visibleTile.isKnownMountain) markTileAsPassable(tile)
    })

    return this
  }
}
