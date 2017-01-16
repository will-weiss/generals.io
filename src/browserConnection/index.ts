import { delay } from 'bluebird'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import validateVisibleGameState from './validateVisibleGameState'
import { VisibleGameInformation, Order, Tile } from '../types'
import { botName, generalsIoUrl, webdriverOpts, viewportSize } from '../config'
import * as selectors from './selectors'


type Browser = webdriverio.Client<void>


interface BrowserConnection {
  loading: Promise<void>
  submitOrder(order: Order | undefined, lastTurn: number): Promise<VisibleGameInformation>
  beginTutorial(): Promise<VisibleGameInformation>
  beginFFAGame(): Promise<VisibleGameInformation>
  begin1v1Game(): Promise<VisibleGameInformation>
  clickExitGameButton(): Promise<void>
  getReplays(): Promise<string[]>
  waitForMainPage(): Promise<void>
}

const createBrowserConnection = (): BrowserConnection => {
  const browser = webdriverio.remote(webdriverOpts).init().url(generalsIoUrl)
  const loading = load()

  return { loading, submitOrder, beginTutorial, begin1v1Game, beginFFAGame, clickExitGameButton, getReplays, waitForMainPage }

  async function load(): Promise<void> {
    await browser.setViewportSize(viewportSize, false)
    await browser.execute(scrapeCurrentStateScript)
    await enterName()
  }

  async function enterName(): Promise<void> {
    await browser.setValue(selectors.nameInput, botName)
  }

  async function click(selector: string): Promise<void> {
    await browser.click(selector)
  }

  async function clickTile(tile: Tile, doubleClick?: boolean): Promise<void> {
    const selector = selectors.ofTile(tile)
    await click(selector)
    if (doubleClick) await click(selector)
  }

  async function clickExitGameButton(): Promise<void> {
    await click(selectors.exitGame)
  }

  async function clickReplayListButton(): Promise<void> {
    await click(selectors.replayList)
  }

  function scrapeReplays(): string[] {
    return Array.from(document.querySelectorAll(selectors.replayLink))
      .map((anchor: HTMLAnchorElement) => anchor.href)
  }

  async function getReplays(): Promise<string[]> {
    await clickReplayListButton()
    await browser.waitForVisible(selectors.replays)

    while (await browser.isVisible(selectors.loadMore)) {
      await click(selectors.loadMore)
      delay(200)
    }

    const replays = (await browser.execute(scrapeReplays)).value

    await click(selectors.exitReplays)

    return replays
  }

  async function orderHasResolved(tile: Tile): Promise<boolean> {
    return !(await browser.isExisting(selectors.ofOrderArrow(tile)))
  }

  async function waitUntil(predicate: () => Promise<boolean>): Promise<void> {
    await browser.waitUntil(predicate, 20000)
  }

  async function issueOrder(order: Order): Promise<void> {
    try {
      const { from, to, splitArmy } = order
      await clickTile(from, splitArmy)
      await clickTile(to)
      await waitUntil(() => orderHasResolved(from))
    } catch (err) {
      console.error(err)
    }
  }

  async function submitOrder(order: Order | undefined, lastTurn: number): Promise<VisibleGameInformation> {
    const completed = order ? issueOrder(order) : waitUntil(() => turnHasIncremented(lastTurn))
    await completed
    return scrapeCurrentState()
  }

  async function beginTutorial(): Promise<VisibleGameInformation> {
    await click(selectors.playGame)
    await waitForGameToStart()
    return scrapeCurrentState()
  }

  async function beginRegularGame(selector: string): Promise<VisibleGameInformation> {
    await click(selectors.playGame)
    await browser.waitForVisible(selectors.gameModes, 1000)
    await click(selector)
    await waitForGameToStart()
    return scrapeCurrentState()
  }

  async function beginFFAGame(): Promise<VisibleGameInformation> {
    return beginRegularGame(selectors.ffa)
  }

  async function begin1v1Game(): Promise<VisibleGameInformation> {
    return beginRegularGame(selectors.oneVsOne)
  }

  async function waitForGameToStart(): Promise<void> {
    while (!(await browser.isVisible(selectors.turnCounter))) continue
  }

  async function scrapeCurrentState(): Promise<VisibleGameInformation> {
    const result = await browser.execute(function(): any { return (window as any).scrapeCurrentState() })
    return result.value as VisibleGameInformation
  }

  async function turnHasIncremented(lastTurn: number): Promise<boolean> {
    const turnCounterText = await browser.getText(selectors.turnCounter) as string
    const match = turnCounterText.match(/\d+/)
    if (!match) throw new Error('Could locate turn counter')
    return parseInt(match[0], 10) > lastTurn
  }

  async function waitForMainPage(): Promise<void> {
    await browser.waitForVisible(selectors.mainMenu, 5000)
  }
}

const browserConnection = createBrowserConnection()

export default browserConnection
