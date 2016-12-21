import { LivePlayerColor, VisibleTile, LeaderboardRow, VisibleGameState } from '../types'


export default function scrapeCurrentStateScript(): void {

  /* tslint:disable */
  const global: Window & { scrapeCurrentState: Function } = (typeof window === 'undefined') ? this : window
  /* tslint:enable */

  global.scrapeCurrentState = (() => {

    const playerColors: LivePlayerColor[] = ['blue', 'teal', 'darkgreen', 'red', 'orange', 'green', 'purple', 'maroon']

    const toInt = (str: string) => Number.parseInt(str.trim(), 10)
    const getElementById = (id: string): HTMLElement => global.document.getElementById(id)!
    const getText = (element: HTMLElement): string => element.innerText || element.textContent || ''
    const getInt = (element: HTMLElement): number => toInt(getText(element)) || 0
    const hasClass = (element: HTMLElement) => (className: string): boolean => element.classList.contains(className)
    const getColorOf = (element: HTMLElement): LivePlayerColor | undefined => playerColors.find(hasClass(element))

    function getMatrixOf(id: string): HTMLTableDataCellElement[][] {
      const table = getElementById(id)
      const tbody = table.querySelector('tbody')!
      const tableRows = Array.from(tbody.querySelectorAll('tr')) as HTMLTableRowElement[]
      return tableRows.map(tr => Array.from(tr.querySelectorAll('td')))
    }

    function scrapeTurn(): number {
      const turnCounter = getElementById('turn-counter')!
      const turnCount = getText(turnCounter).trim().replace('Turn ', '')
      return toInt(turnCount)
    }

    function scrapeTileState(rowIndex: number, colIndex: number, td: HTMLTableDataCellElement): VisibleTile {
      const tdHasClass = hasClass(td)
      const isMountain = tdHasClass('mountain') || tdHasClass('obstacle')
      const isVisible = !tdHasClass('fog') || isMountain
      const isGeneral = tdHasClass('general')
      const isCity = isGeneral || tdHasClass('city')
      const army = getInt(td)
      const color = army ? (getColorOf(td) || 'grey') : null
      return { rowIndex, colIndex, isVisible, isMountain, color, isGeneral, isCity, army }
    }

    function scrapeMapState(): VisibleTile[] {
      const mapState: VisibleTile[] = []

      getMatrixOf('map').forEach((dataCells, rowIndex) =>
        dataCells.forEach((td, colIndex) =>
          mapState.push(scrapeTileState(rowIndex, colIndex, td))))

      return mapState
    }

    function scrapeLeaderboardRowState(playerRow: HTMLTableDataCellElement[]): LeaderboardRow {
      const [playerNameCell, armyCell, landCell] = playerRow.slice(1)
      const name = getText(playerNameCell)
      const color = getColorOf(playerNameCell)!
      const army = getInt(armyCell)
      const land = getInt(landCell)
      return { name, color, army, land }
    }

    function scrapeLeaderboardState(): LeaderboardRow[] {
      const gameLeaderboard = getMatrixOf('game-leaderboard')
      const playerRows = gameLeaderboard.slice(1)
      return playerRows.map(scrapeLeaderboardRowState)
    }

    const scrapeGameOverState = () => {
      const gameResultHeader = global.document.querySelector('#game-page > .alert.center > center > h1') as HTMLHeadingElement | null
      const over = !!gameResultHeader
      const victorious = over && (getText(gameResultHeader!) === 'You won!')
      return { over, victorious }
    }

    function scrapeCurrentState(): VisibleGameState {
      return {
        game: scrapeGameOverState(),
        turn: scrapeTurn(),
        tiles: scrapeMapState(),
        leaderboard: scrapeLeaderboardState(),
      }
    }

    return scrapeCurrentState
  })()
}