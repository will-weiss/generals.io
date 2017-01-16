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
  myColor: LivePlayerColor
  myCrown: Tile
}

export interface HiddenGameConfiguration {
  cities: Set<Tile>
  crowns: Map<LivePlayerColor, Tile>
  passable: Set<Tile>
  unknownObstacles: Set<Tile>
  adjacencies: Map<Tile, Set<Tile>>
  distances: Map<Tile, Map<Tile, number>>
}

export interface GameConfiguration {
  revealed: RevealedGameConfiguration
  hidden: HiddenGameConfiguration
}

export interface CompleteGameInformation {
  config: GameConfiguration
  state: GameState
}

export interface PlayerStatus {
  alive: boolean
  land: number
  army: number
}

export type Armies = Map<Tile, number>

export interface GameState {
  turn: number
  gameOver: boolean
  victorious: boolean
  leaderboard: Map<PlayerColor, PlayerStatus>
  armies: Map<PlayerColor, Map<Tile, number>>
  pastState: GameState | undefined
}

export interface VisibleTileInformation {
  rowIndex: number
  colIndex: number
  isVisible: boolean
  isUnknownObstacle?: boolean
  isKnownMountain: boolean
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

export interface VisibleGameInformation {
  turn: number
  tiles: VisibleTileInformation[]
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

export type Strategy = (gameInfo: CompleteGameInformation) => Order | undefined

export type Evaluator = (gameInfo: CompleteGameInformation, order: Order | undefined) => number
