import { EventEmitter } from 'events'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import validateVisibleGameState from './validateVisibleGameState'
import { VisibleGameState, Order, Tile } from '../types'


type Browser = webdriverio.Client<void>

const generalsIoUrl = 'http://generals.io'
const webdriverOpts = { desiredCapabilities: { browserName: 'firefox' } }


export default class BrowserGame extends EventEmitter {
  private browser: Browser
  private lastVisibleState: VisibleGameState | undefined

  constructor() {
    super()
    this.browser = webdriverio.remote(webdriverOpts).init().url(generalsIoUrl)
    this.lastVisibleState = undefined
    this.loadScrapeStateScript().then(() => this.beginGame())
  }

  submitOrder(order: Order | undefined): Promise<void> {
    if (!order) return Promise.resolve()
    const { from, to, splitArmy } = order
    return new Promise((resolve, reject) =>
      this.clickTile(from, splitArmy)
        .then(() => this.clickTile(to))
        .then(() => resolve())
        .catch(reject)) as Promise<any>
  }

  private clickTile(tile: Tile, doubleClick?: boolean): Browser {
    const selector = `#map > tbody > tr:nth-child(${tile.rowIndex + 1}) > td:nth-child(${tile.colIndex + 1})`
    const clicking = this.browser.click(selector)
    return doubleClick ? clicking.then(() => this.clickTile(tile)) : clicking
  }

  private loadScrapeStateScript(): Promise<any> {
    return this.browser.execute(scrapeCurrentStateScript) as any
  }

  private beginGame(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.browser.click('button.big')
        .waitForVisible('td.selectable.general', 1000)
        .then(visible => visible ? resolve() : reject('Game could not begin'))
        .catch(reject)
    })
      .then(() => this.scrapeCurrentState())
      .then(() => this.emit('start', this.lastVisibleState))
      .then(() => this.waitForNextTurn())
  }

  private scrapeCurrentState(): Promise<VisibleGameState> {
    return new Promise((resolve, reject) =>
      this.browser.execute(function(): any { return (window as any).scrapeCurrentState() })
        .then(result => this.lastVisibleState = validateVisibleGameState(result.value))
        .then(resolve, reject))
  }

  private waitForNextTurn(): any {
    const lastTurn = this.lastVisibleState!.turn
    return (this.browser.waitUntil(() =>
      (this.browser.getText('#turn-counter') as any).then((turnCounterText: string) => {
        const match = turnCounterText.match(/\d+/)
        if (!match) throw new Error('Could locate turn counter')
        return parseInt(match[0], 10) > lastTurn
      })
    , 20000) as any)
      .then(() => this.scrapeCurrentState())
      .then(() => this.emit('nextTurn', this.lastVisibleState))
      .then(() => this.lastVisibleState!.game.over ? this.emit('gameOver') : this.waitForNextTurn())
  }
}
