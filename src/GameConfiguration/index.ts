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
    visibleGameState.tiles.forEach(visibleTile => {
      const tile = this.revealed.grid[visibleTile.rowIndex][visibleTile.colIndex]
      if (visibleTile.isCity) this.hidden.cities.add(tile)
      if (visibleTile.isGeneral) this.hidden.crowns.set(visibleTile.color as LivePlayerColor, tile)
    })
  }
}
