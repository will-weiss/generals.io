import { EventEmitter } from 'events'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import validateVisibleGameState from './validateVisibleGameState'
import { VisibleGameInformation, Order, Tile } from '../types'


type Browser = webdriverio.Client<void>

const generalsIoUrl = 'http://generals.io'
const webdriverOpts = { desiredCapabilities: { browserName: 'chrome' } }

function selectorOfTile(tile: Tile): string {
  return `#map > tbody > tr:nth-child(${tile.rowIndex + 1}) > td:nth-child(${tile.colIndex + 1})`
}

function orderSelectorOfTile(tile: Tile): string {
  return `${selectorOfTile(tile)} > div.center-vertical`
}

interface Connection {
  loading: Promise<void>
  submitOrder(order: Order | undefined): Promise<void>
  beginTutorial(): Promise<void>
  begin1v1Game(): Promise<void>
  waitForGameToStart(): Promise<any>
  scrapeCurrentState(): Promise<VisibleGameInformation>
  waitForTick(lastOrder: Order | undefined, lastVisibleState: VisibleGameInformation | undefined): Promise<void>
}

const createConnection = (): Connection => {
  const browser = webdriverio.remote(webdriverOpts).init().url(generalsIoUrl)
  const loading = Promise.resolve(browser.execute(scrapeCurrentStateScript) as any)

  return { loading, submitOrder, beginTutorial, begin1v1Game, scrapeCurrentState, waitForGameToStart, waitForTick }

  async function click(selector: string): Promise<void> {
    await browser.click(selector)
  }

  async function clickTile(tile: Tile, doubleClick?: boolean): Promise<void> {
    const selector = selectorOfTile(tile)
    await click(selector)
    if (doubleClick) await click(selector)
  }

  async function submitOrder(order: Order | undefined): Promise<void> {
    if (!order) return
    const { from, to, splitArmy } = order
    await clickTile(from, splitArmy)
    await clickTile(to)
  }

  async function beginTutorial(): Promise<void> {
    await click('button.big')
    await browser.waitForVisible('td.selectable.general', 1000)
  }

  async function begin1v1Game(): Promise<void> {
    await click('button.big')
    await browser.waitForVisible('#game-modes', 1000)
    await click('#game-modes > center > button.inverted:first-of-type ~ button')
    await waitForGameToStart()
  }

  async function waitForGameToStart(): Promise<boolean> {
    const gameStarted = await browser.isVisible('#turn-counter')
    return gameStarted || waitForGameToStart()
  }

  async function scrapeCurrentState(): Promise<VisibleGameInformation> {
    const result = await browser.execute(function(): any { return (window as any).scrapeCurrentState() })
    return result.value as VisibleGameInformation
  }

  async function orderHasResolved(lastOrder: Order): Promise<boolean> {
    const orderSelector = orderSelectorOfTile(lastOrder.from)
    return !(await browser.isExisting(orderSelector))
  }

  async function turnHasIncremented(lastTurn: number): Promise<boolean> {
    const turnCounterText = await browser.getText('#turn-counter') as string
    const match = turnCounterText.match(/\d+/)
    if (!match) throw new Error('Could locate turn counter')
    return parseInt(match[0], 10) > lastTurn
  }

  async function waitForTick(lastOrder: Order | undefined, lastVisibleState: VisibleGameInformation | undefined): Promise<void> {
    const waitUntil = lastOrder ? () => orderHasResolved(lastOrder) : () => turnHasIncremented(lastVisibleState!.turn)
    await browser.waitUntil(waitUntil, 20000)
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
    await this.connection.submitOrder(order)
    this.waitForTick()
  }

  async beginTutorial(): Promise<void> {
    await this.connection.beginTutorial()
    await this.startPlayingGame()
  }

  async begin1v1Game(): Promise<void> {
    await this.connection.begin1v1Game()
    await this.startPlayingGame()
  }

  private async startPlayingGame(): Promise<void> {
    await this.scrapeCurrentState()
    this.emit('start', this.lastVisibleState)
  }

  private async scrapeCurrentState(): Promise<void> {
    this.lastVisibleState = await this.connection.scrapeCurrentState()
  }

  private async waitForTick(): Promise<void> {
    await this.connection.waitForTick(this.lastOrder, this.lastVisibleState)
    this.afterTick()
  }

  private async afterTick(): Promise<void> {
    await this.scrapeCurrentState()
    this.emit('nextTick', this.lastVisibleState)
    if (this.lastVisibleState!.game.over) this.emit('gameOver')
  }
}
