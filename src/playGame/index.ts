import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameInformation } from '../types'
import connection from '../connection'
import * as Strategies from '../Strategy'


const strategies = Object.keys(Strategies)

interface GamePlayOpts {
  onStartMessage: string
  onEndMessage: string
  getStrategy: (cli: any) => Promise<string>
  beginGame: () => void
}


function promptUserForStrategy(cli): Promise<string> {
  const prompt = [{ type: 'list', name: 'strategy', message: 'Choose a strategy: ', choices: strategies }]
  return new Promise(resolve => cli.prompt(prompt, ({ strategy }) => resolve(strategy)))
}

function playGameUsing(opts: GamePlayOpts) {
  return async function playGame(cli): Promise<void> {
    const strategyKey = await opts.getStrategy(cli)
    const strategy = Strategies[strategyKey]
    // await connection.connection.loading
    console.log(opts.onStartMessage)
    opts.beginGame()
    await playGameOnceStarted(connection, strategy)
    console.log(opts.onEndMessage)
  }
}

export function playGameOnceStarted(connection: BrowserGame, strategy: Strategy): Promise<VisibleGameInformation> {
  return new Promise((resolve, reject) => {
    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const order: Order | undefined = strategy({ config: gameConfiguration, state: gameState })
      return connection.submitOrder(order).catch(reject)
    }

    function onGameStart(visibleState: VisibleGameInformation): void {
      gameConfiguration = new GameConfiguration('Anonymous', visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    function onnextTick(visibleState: VisibleGameInformation): void {
      gameConfiguration = gameConfiguration.update(visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    connection.once('start', onGameStart)
    connection.on('nextTick', onnextTick)
    connection.on('gameOver', resolve)
    connection.on('error', error => reject(error))
  })
}


export const playFFA = playGameUsing({
  onStartMessage: 'Starting a FFA game...',
  onEndMessage: 'Game over',
  beginGame: () => connection.beginFFAGame(),
  getStrategy: promptUserForStrategy
})

export const play1v1 = playGameUsing({
  onStartMessage: 'Starting a 1v1 game...',
  onEndMessage: 'Game over',
  beginGame: () => connection.begin1v1Game(),
  getStrategy: promptUserForStrategy
})

export const playTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: () => connection.beginTutorial(),
  getStrategy: promptUserForStrategy
})

export const beatTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: () => connection.beginTutorial(),
  getStrategy: () => Promise.resolve('beatTutorial')
})
