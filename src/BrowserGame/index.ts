import { EventEmitter } from 'events'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import validateVisibleGameState from './validateVisibleGameState'
import { VisibleGameInformation, Order, Tile } from '../types'
import { botName, generalsIoUrl, webdriverOpts } from '../config'


type Browser = webdriverio.Client<void>

const buttonSelectors = {
  'ffa': '#game-modes > center > button.inverted:first-of-type',
  '1v1': '#game-modes > center > button.inverted:first-of-type ~ button'
}

function selectorOfTile(tile: Tile): string {
  return `#map > tbody > tr:nth-child(${tile.rowIndex + 1}) > td:nth-child(${tile.colIndex + 1})`
}

function orderSelectorOfTile(tile: Tile): string {
  return `${selectorOfTile(tile)} > div[class*="center-"]`
}

interface Connection {
  loading: Promise<void>
  submitOrder(order: Order | undefined, lastTurn: number): Promise<VisibleGameInformation>
  beginTutorial(): Promise<VisibleGameInformation>
  beginFFAGame(): Promise<VisibleGameInformation>
  begin1v1Game(): Promise<VisibleGameInformation>
  clickExitButton(): Promise<void>
}

const createConnection = (): Connection => {
  const browser = webdriverio.remote(webdriverOpts).init().url(generalsIoUrl)
  const loading = load()

  return { loading, submitOrder, beginTutorial, begin1v1Game, beginFFAGame, clickExitButton }

  async function load(): Promise<void> {
    await browser.execute(scrapeCurrentStateScript)
    await enterName()
  }

  async function enterName(): Promise<void> {
    await browser.setValue('input[placeholder="Anonymous"]', botName)
  }

  async function click(selector: string): Promise<void> {
    await browser.click(selector)
  }

  async function clickTile(tile: Tile, doubleClick?: boolean): Promise<void> {
    const selector = selectorOfTile(tile)
    await click(selector)
    if (doubleClick) await click(selector)
  }

  async function clickExitButton(): Promise<void> {
    await click('.alert > center > button.inverted')
  }

  async function orderHasResolved(tile: Tile): Promise<boolean> {
    return !(await browser.isExisting(orderSelectorOfTile(tile)))
  }

  async function waitUntil(predicate: () => Promise<boolean>): Promise<void> {
    await browser.waitUntil(predicate, 20000)
  }

  async function issueOrder(order: Order): Promise<void> {
    const { from, to, splitArmy } = order
    await clickTile(from, splitArmy)
    await clickTile(to)
    await waitUntil(() => orderHasResolved(from))
  }

  async function submitOrder(order: Order | undefined, lastTurn: number): Promise<VisibleGameInformation> {
    const completed = order ? issueOrder(order) : waitUntil(() => turnHasIncremented(lastTurn))
    await completed
    return scrapeCurrentState()
  }

  async function beginTutorial(): Promise<VisibleGameInformation> {
    await click('button.big')
    await browser.waitForVisible('td.selectable.general', 1000)
    return scrapeCurrentState()
  }

  async function beginRegularGame(selector: string): Promise<VisibleGameInformation> {
    await click('button.big')
    await browser.waitForVisible('#game-modes', 1000)
    await click(selector)
    await waitForGameToStart()
    return scrapeCurrentState()
  }

  async function beginFFAGame(): Promise<VisibleGameInformation> {
    return beginRegularGame(buttonSelectors['ffa'])
  }

  async function begin1v1Game(): Promise<VisibleGameInformation> {
    return beginRegularGame(buttonSelectors['1v1'])
  }

  async function waitForGameToStart(): Promise<boolean> {
    const gameStarted = await browser.isVisible('#turn-counter')
    return gameStarted || waitForGameToStart()
  }

  async function scrapeCurrentState(): Promise<VisibleGameInformation> {
    const result = await browser.execute(function(): any { return (window as any).scrapeCurrentState() })
    return result.value as VisibleGameInformation
  }

  async function turnHasIncremented(lastTurn: number): Promise<boolean> {
    const turnCounterText = await browser.getText('#turn-counter') as string
    const match = turnCounterText.match(/\d+/)
    if (!match) throw new Error('Could locate turn counter')
    return parseInt(match[0], 10) > lastTurn
  }
}


export default class BrowserGame extends EventEmitter {
  private lastOrder: Order | undefined
  private lastVisibleState: VisibleGameInformation | undefined
  private connection: Connection

  constructor() {
    super()
    this.lastOrder = undefined
    this.lastVisibleState = undefined
    this.connection = createConnection()
  }

  async submitOrder(order: Order | undefined): Promise<void> {
    this.lastOrder = order
    this.lastVisibleState = await this.connection.submitOrder(order, this.turn)
    this.lastVisibleState.game.over
      ? this.emit('gameOver')
      : this.emit('nextTick', this.lastVisibleState)
  }

  async beginTutorial(): Promise<void> {
    await this.beginGame(() => this.connection.beginTutorial())
  }

  async beginFFAGame(): Promise<void> {
    await this.beginGame(() => this.connection.beginFFAGame())
  }

  async begin1v1Game(): Promise<void> {
    await this.beginGame(() => this.connection.begin1v1Game())
  }

  async exitGame(): Promise<void> {
    await this.connection.clickExitButton()
  }

  private async beginGame(beginGameViaConnection: () => Promise<VisibleGameInformation>): Promise<void> {
    await this.connection.loading
    this.lastVisibleState = await beginGameViaConnection()
    this.emit('start', this.lastVisibleState)
  }

  private get turn(): number {
    return this.lastVisibleState ? this.lastVisibleState.turn : -1
  }
}
