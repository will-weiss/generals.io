export type NpcColor = 'grey'
export type LivePlayerColor = 'blue' | 'teal' | 'darkgreen' | 'red' | 'orange' | 'green' | 'purple' | 'maroon'
export type PlayerColor = NpcColor | LivePlayerColor
export type PossibleTileColor = PlayerColor | null

export const LivePlayerColors: LivePlayerColor[] = ['blue', 'teal', 'darkgreen', 'red', 'orange', 'green', 'purple', 'maroon']
export const PlayerColors: PlayerColor[] = (LivePlayerColors as PlayerColor[]).concat(['grey'])
export const PossibleTileColors: PossibleTileColor[] = (PlayerColors as PossibleTileColor[]).concat([null])

export type TileCoordinates = [number, number]

export interface Tile {
  rowIndex: number
  colIndex: number
}

export interface RevealedGameConfiguration {
  playerColors: LivePlayerColor[]
  height: number
  width: number
  grid: Tile[][]
  tiles: Set<Tile>
  passable: Set<Tile>
  myColor: LivePlayerColor
  myCrown: Tile
  adjacencies: Map<Tile, Set<Tile>>
  distances: Map<Tile, Map<Tile, number>>
}

export interface HiddenGameConfiguration {
  cities: Set<Tile>
  crowns: Map<LivePlayerColor, Tile>
}

export interface GameConfiguration {
  revealed: RevealedGameConfiguration
  hidden: HiddenGameConfiguration
}

export interface PlayerStatus {
  alive: boolean
  land: number
  army: number
}

export interface GameState {
  turn: number
  gameOver: boolean
  victorious: boolean
  leaderboard: Map<PlayerColor, PlayerStatus>
  armies: Map<PlayerColor, Map<Tile, number>>
  pastState: GameState | undefined
}

export interface VisibleTile {
  rowIndex: number
  colIndex: number
  isVisible: boolean
  isMountain: boolean
  isGeneral: boolean
  isCity: boolean
  color: PossibleTileColor
  army: number
}

export interface LeaderboardRow {
  name: string
  color: LivePlayerColor
  army: number
  land: number
}

export interface VisibleGameState {
  turn: number
  tiles: VisibleTile[]
  leaderboard: LeaderboardRow[]
  game: {
    over: boolean
    victorious: boolean
  }
}

export interface Order {
  from: Tile
  to: Tile
  splitArmy: boolean
}

export type Strategy = (gameConfiguration: GameConfiguration, gameState: GameState) => Order[]
