import { GameConfiguration, VisibleGameState, GameState } from '../types'


export default function createGameState(
  config: GameConfiguration,
  visibleState: VisibleGameState,
  pastState?: GameState
): GameState {
  const turn = visibleState.turn
  const gameOver = visibleState.game.over
  const victorious = visibleState.game.victorious
  const leaderboard = new Map()
  const armies = new Map().set('grey', new Map())

  config.revealed.playerColors.forEach(color => {
    const leaderboardRow = visibleState.leaderboard.find(row => row.color === color)
    const playerStatus = leaderboardRow
      ? { alive: !!leaderboardRow.army, army: leaderboardRow.army, land: leaderboardRow.land }
      : { alive: false, army: 0, land: 0 }

    leaderboard.set(color, playerStatus)
    armies.set(color, new Map())
  })

  visibleState.tiles.forEach(visibleTile => {
    if (!visibleTile.color) return
    const tile = config.revealed.grid[visibleTile.rowIndex][visibleTile.colIndex]
    armies.get(visibleTile.color)!.set(tile, visibleTile.army)
  })

  return { turn, gameOver, victorious, leaderboard, armies, pastState }
}


