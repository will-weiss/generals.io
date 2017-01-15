import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { stub, SinonStub } from 'sinon'
import { EventEmitter } from 'events'
import sampleFirstTurnVisibleGameInformation from '../sampleFirstTurnVisibleGameInformation'
import { playGameOnceStarted } from './index'


describe('playGameOnceStarted', () => {
  it('listens for game events, passes visible game states to a particular strategy submits calculated orders, and resolves with the last visible game state when the game is over', async () => {
    const connection = new EventEmitter() as EventEmitter & { submitOrder: SinonStub }
    connection.submitOrder = stub().returns(Promise.resolve())

    const strategy = stub()
    strategy.onFirstCall().returns('order after game start')
    strategy.onSecondCall().returns('order after next turn')

    const nextTickGameState = cloneDeep(sampleFirstTurnVisibleGameInformation)
    nextTickGameState.turn = 1

    const gameOverGameState = cloneDeep(nextTickGameState)
    gameOverGameState.turn = 2
    gameOverGameState.game.over = true
    gameOverGameState.game.victorious = true

    function tickThenEmit(eventName: string, visibleGameState): Promise<void> {
      return new Promise(resolve => process.nextTick(() => {
        connection.emit(eventName, visibleGameState)
        resolve()
      })) as Promise<any>
    }

    const inProgressGame = playGameOnceStarted(connection as any, strategy)

    await tickThenEmit('start', sampleFirstTurnVisibleGameInformation)
    await tickThenEmit('nextTick', nextTickGameState)
    await tickThenEmit('gameOver', gameOverGameState)

    const result = await inProgressGame

    expect(result).to.equal(gameOverGameState)
    expect(connection.submitOrder.callCount).to.equal(2)
    expect(connection.submitOrder.firstCall.args).to.deep.equal(['order after game start', 0])
    expect(connection.submitOrder.secondCall.args).to.deep.equal(['order after next turn', 1])
  })
})
