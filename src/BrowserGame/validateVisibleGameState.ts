import { expect } from 'chai'
import { VisibleGameState, PlayerColors, PossibleTileColors } from '../types'


export default function validateVisibleGameState(visibleState: VisibleGameState): VisibleGameState {

  expect(visibleState).to.have.property('turn').that.is.not.below(0)
  expect(visibleState).to.have.deep.property('game.over').that.is.a('boolean')
  expect(visibleState).to.have.deep.property('game.victorious').that.is.a('boolean')
  expect(visibleState).to.have.property('leaderboard').that.is.an('array').that.has.length.above(1)
  expect(visibleState).to.have.property('tiles').that.is.an('array').that.has.length.above(1)

  visibleState.leaderboard.forEach(leaderboardRow => {
    expect(leaderboardRow).to.have.property('color').that.is.oneOf(PlayerColors)
    expect(leaderboardRow).to.have.property('name').that.is.a('string')
    expect(leaderboardRow).to.have.property('army').that.is.a('number').that.is.not.below(0)
    expect(leaderboardRow).to.have.property('land').that.is.a('number').that.is.not.below(0)
  })

  const observedCoordinates: Set<string> = new Set()
  let height = 1
  let width = 1

  visibleState.tiles.forEach(visibleTile => {
    expect(visibleTile).to.have.property('rowIndex').that.is.a('number').that.is.not.below(0)
    expect(visibleTile).to.have.property('colIndex').that.is.a('number').that.is.not.below(0)
    expect(visibleTile).to.have.property('army').that.is.a('number').that.is.not.below(0)
    expect(visibleTile).to.have.property('isVisible').that.is.a('boolean')
    expect(visibleTile).to.have.property('isCity').that.is.a('boolean')
    expect(visibleTile).to.have.property('isGeneral').that.is.a('boolean')
    expect(visibleTile).to.have.property('isMountain').that.is.a('boolean')
    expect(visibleTile).to.have.property('color').that.is.oneOf(PossibleTileColors)

    const { rowIndex, colIndex, army, color, isCity, isGeneral, isVisible, isMountain } = visibleTile

    const coordinates = `(${rowIndex},${colIndex})`
    if (observedCoordinates.has(coordinates)) throw new Error(`Duplicate tiles with coordinates: ${coordinates}`)
    observedCoordinates.add(coordinates)

    height = Math.max(height, visibleTile.rowIndex + 1)
    width = Math.max(width, visibleTile.colIndex + 1)

    const isInvisibleOrImpassable = !isVisible || isMountain
    const hasArmy = army > 0
    const hasColor = !!color

    expect(!isMountain              || isVisible).to.be.true
    expect(!isGeneral               || isCity).to.be.true
    expect(!isCity                  || hasArmy).to.be.true
    expect(!isInvisibleOrImpassable || !hasArmy).to.be.true
    expect(hasArmy === hasColor).to.be.true
  })

  expect(visibleState.tiles).to.have.length(height * width, `Number of visible tiles does not equal height * width: ${height * width}`)

  return visibleState
}
