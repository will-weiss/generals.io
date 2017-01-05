import createRevealedGameConfiguration from './createRevealedGameConfiguration'
import { RevealedGameConfiguration, HiddenGameConfiguration, VisibleGameInformation, GameConfiguration, LivePlayerColor } from '../types'


export default class XGameConfiguration implements GameConfiguration {
  revealed: RevealedGameConfiguration
  hidden: HiddenGameConfiguration

  constructor(myName: string, firstVisibleState: VisibleGameInformation) {
    this.revealed = createRevealedGameConfiguration(myName, firstVisibleState)
    this.hidden = { cities: new Set(), crowns: new Map() }
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
