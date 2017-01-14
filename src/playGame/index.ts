import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameInformation } from '../types'
import connection from '../connection'
import * as Strategies from '../Strategy'

const strategies = Object.keys(Strategies)


export function playGame(opts, args, callback): void {
  this.prompt([
    {
      type: 'list',
      name: 'strategy',
      message: 'Choose a strategy: ',
      choices: strategies
    }
  ], async ({ strategy }) => {
    await connection.loading
    console.log(opts.onStartMessage)
    opts.beginGame()
    return playGameOnceStarted(connection, Strategies[strategy])
      .then(finalState => console.log(opts.onEndMessage, finalState), callback())
      .catch(callback)
  })
}

export function play1v1(args, callback): void {
  const opts = {
    onStartMessage: 'Starting a 1v1 game...',
    onEndMessage: 'Game over',
    beginGame: () => connection.begin1v1Game(),
  }
  playGame.call(this, opts, args, callback)
}

export function playTutorial(args, callback): void {
  const opts = {
    onStartMessage: 'Starting the tutorial...',
    onEndMessage: 'Tutorial over',
    beginGame: () => connection.beginTutorial(),
  }
  playGame.call(this, opts, args, callback)
}

export function playGameOnceStarted(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameInformation> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const order: Order | undefined = strategy(gameConfiguration, gameState)
      return connection.submitOrder(order).catch(reject)
    }

    function onGameStart(visibleState: VisibleGameInformation): void {
      gameConfiguration = new GameConfiguration('Anonymous', visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    function onNextTurn(visibleState: VisibleGameInformation): void {
      gameConfiguration = gameConfiguration.update(visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    connection.once('start', onGameStart)
    connection.on('nextTurn', onNextTurn)
    connection.on('gameOver', resolve)
    connection.on('error', error => reject(error))
  })
}


