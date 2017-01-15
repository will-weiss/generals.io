import BrowserGame from '../BrowserGame'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, GameState, Strategy, VisibleGameInformation } from '../types'
import * as Strategies from '../Strategy'
import { botName } from '../config'


const strategies = Object.keys(Strategies)

interface GamePlayOpts {
  onStartMessage: string
  onEndMessage: string
  getStrategy: (cli: any) => Promise<string>
  beginGame: (browserGame: BrowserGame) => void
  uponGameCompletion: (browserGame: BrowserGame) => Promise<void>
}

function promptUserForStrategy(cli): Promise<string> {
  const prompt = [{ type: 'list', name: 'strategy', message: 'Choose a strategy: ', choices: strategies }]
  return new Promise(resolve => cli.prompt(prompt, ({ strategy }) => resolve(strategy)))
}

const playGameUsing = (opts: GamePlayOpts) => async cli => {
  const strategyKey = await opts.getStrategy(cli)
  const strategy = Strategies[strategyKey]
  const browserGame = new BrowserGame()
  opts.beginGame(browserGame)
  await playGameOnceStarted(browserGame, strategy)
  await opts.uponGameCompletion(browserGame)
  console.log(opts.onEndMessage)
}


export function playGameOnceStarted(browserGame: BrowserGame, strategy: Strategy): Promise<VisibleGameInformation> {
  return new Promise((resolve, reject) => {

    let gameConfiguration: GameConfiguration
    let gameState: GameState

    function takeTurn(): Promise<void> {
      const order: Order | undefined = strategy({ config: gameConfiguration, state: gameState })
      return browserGame.submitOrder(order, gameState.turn).catch(err => {
        console.error(err)
      })
    }

    function onGameStart(visibleState: VisibleGameInformation): void {
      gameConfiguration = new GameConfiguration(botName, visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    function onNextTick(visibleState: VisibleGameInformation): void {
      gameConfiguration = gameConfiguration.update(visibleState)
      gameState = createGameState(gameConfiguration, visibleState)
      takeTurn()
    }

    browserGame.once('start', onGameStart)
    browserGame.on('nextTick', onNextTick)
    browserGame.on('gameOver', resolve)
    browserGame.on('error', error => reject(error))
  })
}


export const playFFA = playGameUsing({
  onStartMessage: 'Starting a FFA game...',
  onEndMessage: 'Game over',
  beginGame: browserGame => browserGame.beginFFAGame(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: browserGame => browserGame.exitGame()
})

export const play1v1 = playGameUsing({
  onStartMessage: 'Starting a 1v1 game...',
  onEndMessage: 'Game over',
  beginGame: browserGame => browserGame.begin1v1Game(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: browserGame => browserGame.exitGame()
})

export const playTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: browserGame => browserGame.beginTutorial(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: browserGame => browserGame.exitGame()
})

export const beatTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: browserGame => browserGame.beginTutorial(),
  getStrategy: () => Promise.resolve('beatTutorial'),
  uponGameCompletion: browserGame => browserGame.exitGame()
})
