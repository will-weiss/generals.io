import { sample } from 'lodash'
import BrowserGame from './BrowserGame'
import GameConfiguration from './GameConfiguration'
import { VisibleGameState, PlayerColor, PlayerStatus, Tile, Order } from './types'


class GameState {
  turn: number
  gameOver: boolean
  victorious: boolean
  pastState: GameState | undefined
  leaderboard: Map<PlayerColor, PlayerStatus>
  armies: Map<PlayerColor, Map<Tile, number>>

  constructor(public config: GameConfiguration, firstVisibleState: VisibleGameState) {
    this.turn = firstVisibleState.turn
    this.gameOver = firstVisibleState.game.over
    this.victorious = firstVisibleState.game.victorious
    this.pastState = undefined
    this.leaderboard = new Map()
    this.armies = new Map()
    this.armies.set('grey', new Map())

    this.config.revealed.playerColors.forEach(color => {
      const leaderboardRow = firstVisibleState.leaderboard.find(row => row.color === color)
      const playerStatus = leaderboardRow
        ? { alive: !!leaderboardRow.army, army: leaderboardRow.army, land: leaderboardRow.land }
        : { alive: false, army: 0, land: 0 }

      this.leaderboard.set(color, playerStatus)
      this.armies.set(color, new Map())
    })

    firstVisibleState.tiles.forEach(VisibleTile => {
      if (!VisibleTile.color) return
      const tile = this.config.revealed.grid[VisibleTile.rowIndex][VisibleTile.colIndex]
      this.armies.get(VisibleTile.color)!.set(tile, VisibleTile.army)
    })
  }
}

function main(): void {

  const connection = new BrowserGame()
  let gameConfiguration: GameConfiguration
  let gameState: GameState

  function takeRandomTurn(): Promise<void> {

    if (gameState.gameOver) return Promise.resolve()
    const myArmies = gameState.armies.get(gameState.config.revealed.myColor)!
    const orders: Order[] = []

    for (const [from, armySize] of myArmies.entries()) {
      if (armySize < 1) continue
      const to: Tile | undefined = sample(Array.from(gameState.config.revealed.adjacencies.get(from)!))
      if (!to) continue
      orders.push({ from, to, splitArmy: Math.random() < 0.5 })
      if (orders.length > 1) break
    }

    return connection.submitOrders(orders)
  }

  connection.once('start', state => {
    console.log('start', state.turn)
    gameConfiguration = new GameConfiguration('Anonymous', state)
    gameState = new GameState(gameConfiguration, state)
    takeRandomTurn()
  })

  connection.on('nextTurn', state => {
    console.log('nextTurn', state.turn)
    gameState = new GameState(gameConfiguration, state)
    takeRandomTurn()
  })

  connection.on('gameOver', state => console.log('gameOver', state))
}

main()

process.on('unhandledRejection', err => console.error(err))
