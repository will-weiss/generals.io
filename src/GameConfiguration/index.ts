import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import createHiddenGameConfiguration from './createHiddenGameConfiguration'
import { RevealedGameConfiguration, HiddenGameConfiguration, VisibleGameState, GameConfiguration, LivePlayerColor } from '../types'


export default class XGameConfiguration implements GameConfiguration {
  revealed: RevealedGameConfiguration
  hidden: HiddenGameConfiguration

  constructor(myName: string, firstVisibleState: VisibleGameState) {
    this.revealed = createRevealedGameConfiguration(myName, firstVisibleState)
    this.hidden = createHiddenGameConfiguration()
    this.update(firstVisibleState)
  }

  update(visibleGameState: VisibleGameState): void {
    visibleGameState.tiles.forEach(VisibleTile => {
      const tile = this.revealed.grid[VisibleTile.rowIndex][VisibleTile.colIndex]
      if (VisibleTile.isCity) this.hidden.cities.add(tile)
      if (VisibleTile.isGeneral) this.hidden.crowns.set(VisibleTile.color as LivePlayerColor, tile)
    })
  }
}
