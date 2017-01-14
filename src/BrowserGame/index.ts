import { EventEmitter } from 'events'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import validateVisibleGameState from './validateVisibleGameState'
import { VisibleGameInformation, Order, Tile } from '../types'


type Browser = webdriverio.Client<void>

const generalsIoUrl = 'http://generals.io'
const webdriverOpts = { desiredCapabilities: { browserName: 'chrome' } }


export default class BrowserGame extends EventEmitter {
  loading: Promise<void>

  private browser: Browser
  private lastVisibleState: VisibleGameInformation | undefined

  constructor() {
    super()
    this.browser = webdriverio.remote(webdriverOpts).init().url(generalsIoUrl)
    this.lastVisibleState = undefined
    this.loading = this.loadScrapeStateScript()
  }

  async submitOrder(order: Order | undefined): Promise<void> {
    if (!order) return
    const { from, to, splitArmy } = order
    await this.clickTile(from, splitArmy)
    await this.clickTile(to)
  }

  async startPlayingGame(): Promise<void> {
    await this.scrapeCurrentState()
    this.emit('start', this.lastVisibleState)
    await this.waitForNextTick()
  }

  async beginTutorial(): Promise<void> {
    await this.click('button.big')
    await this.browser.waitForVisible('td.selectable.general', 1000)
    await this.startPlayingGame()
  }

  async begin1v1Game(): Promise<void> {
    await this.click('button.big')
    await this.browser.waitForVisible('#game-modes', 1000)
    await this.click('#game-modes > center > button.inverted:first-of-type ~ button')
    await this.waitForGameToStart()
    await this.startPlayingGame()
  }

  private async waitForGameToStart(): Promise<any> {
    const gameStarted = await this.browser.isVisible('#turn-counter')
    if (!gameStarted) return this.waitForGameToStart()
  }

  private loadScrapeStateScript(): Promise<any> {
    return this.browser.execute(scrapeCurrentStateScript) as any
  }

  private async click(selector: string): Promise<void> {
    await this.browser.click(selector)
  }

  private async clickTile(tile: Tile, doubleClick?: boolean): Promise<void> {
    const selector = `#map > tbody > tr:nth-child(${tile.rowIndex + 1}) > td:nth-child(${tile.colIndex + 1})`
    await this.click(selector)
    if (doubleClick) await this.click(selector)
  }

  private async scrapeCurrentState(): Promise<VisibleGameInformation> {
    const result = await this.browser.execute(function(): any { return (window as any).scrapeCurrentState() })
    this.lastVisibleState = result.value as VisibleGameInformation
    return this.lastVisibleState
  }

  private async waitForNextTick(): Promise<void> {
    const lastTurn = this.lastVisibleState!.turn

    await this.browser.waitUntil(() =>
      (this.browser.getText('#turn-counter') as any).then((turnCounterText: string) => {
        const match = turnCounterText.match(/\d+/)
        if (!match) throw new Error('Could locate turn counter')
        return parseInt(match[0], 10) > lastTurn
      })
    , 20000)

    await this.scrapeCurrentState()
    this.emit('nextTurn', this.lastVisibleState)

    if (this.lastVisibleState!.game.over) {
      this.emit('gameOver')
    } else {
      await this.waitForNextTick()
    }
  }
}
