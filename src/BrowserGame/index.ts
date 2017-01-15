import { EventEmitter } from 'events'
import browserConnection from '../browserConnection'
import { VisibleGameInformation, Order } from '../types'


export default class BrowserGame extends EventEmitter {
  async submitOrder(order: Order | undefined, turn: number): Promise<void> {
    const nextVisibleGameState = await browserConnection.submitOrder(order, turn)
    nextVisibleGameState.game.over
      ? this.emit('gameOver')
      : this.emit('nextTick', nextVisibleGameState)
  }

  async beginTutorial(): Promise<void> {
    await this.beginGame(() => browserConnection.beginTutorial())
  }

  async beginFFAGame(): Promise<void> {
    await this.beginGame(() => browserConnection.beginFFAGame())
  }

  async begin1v1Game(): Promise<void> {
    await this.beginGame(() => browserConnection.begin1v1Game())
  }

  async exitGame(): Promise<void> {
    await browserConnection.clickExitButton()
  }

  private async beginGame(beginGameViaConnection: () => Promise<VisibleGameInformation>): Promise<void> {
    await browserConnection.loading
    const firstVisibleGameState = await beginGameViaConnection()
    this.emit('start', firstVisibleGameState)
  }
}
