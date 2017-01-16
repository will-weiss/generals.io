import browserConnection from '../browserConnection'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, Strategy, VisibleGameInformation } from '../types'
import * as Strategies from '../Strategy'
import { botName } from '../config'


const strategies = Object.keys(Strategies)

interface GamePlayOpts {
  onStartMessage: string
  onEndMessage: string
  getStrategy: (cli: any) => Promise<string>
  beginGame: () => Promise<VisibleGameInformation>
  uponGameCompletion: () => Promise<void>
}

function promptUserForStrategy(cli): Promise<string> {
  const prompt = [{ type: 'list', name: 'strategy', message: 'Choose a strategy: ', choices: strategies }]
  return new Promise(resolve => cli.prompt(prompt, ({ strategy }) => resolve(strategy)))
}

const playGameUsing = (opts: GamePlayOpts) => async cli => {
  const strategyKey = await opts.getStrategy(cli)
  const strategy = Strategies[strategyKey]
  const firstVisibleGameInformation = await opts.beginGame()
  await playGameOnceStarted(firstVisibleGameInformation, strategy)
  await opts.uponGameCompletion()
  console.log(opts.onEndMessage)
}


export async function playGameOnceStarted(firstVisibleGameInformation: VisibleGameInformation, strategy: Strategy): Promise<void> {
  let gameConfiguration = new GameConfiguration(botName, firstVisibleGameInformation)
  let gameState = createGameState(gameConfiguration, firstVisibleGameInformation)

  while (!gameState.gameOver) await takeTurn()

  async function takeTurn(): Promise<void> {
    try {
      const order: Order | undefined = strategy({ config: gameConfiguration, state: gameState })
      const visibleGameInformation = await browserConnection.submitOrder(order, gameState.turn)
      gameConfiguration = gameConfiguration.update(visibleGameInformation)
      gameState = createGameState(gameConfiguration, visibleGameInformation)
    } catch (err) {
      console.error(err)
    }
  }
}


export const playFFA = playGameUsing({
  onStartMessage: 'Starting a FFA game...',
  onEndMessage: 'Game over',
  beginGame: () => browserConnection.beginFFAGame(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: () => browserConnection.clickExitGameButton()
})

export const playFFARandomly = playGameUsing({
  onStartMessage: 'Starting a FFA game...',
  onEndMessage: 'Game over',
  beginGame: () => browserConnection.beginFFAGame(),
  getStrategy: () => Promise.resolve('getRandomOrder'),
  uponGameCompletion: () => browserConnection.clickExitGameButton()
})

export const play1v1 = playGameUsing({
  onStartMessage: 'Starting a 1v1 game...',
  onEndMessage: 'Game over',
  beginGame: () => browserConnection.begin1v1Game(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: () => browserConnection.clickExitGameButton()
})

export const playTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: () => browserConnection.beginTutorial(),
  getStrategy: promptUserForStrategy,
  uponGameCompletion: () => browserConnection.clickExitGameButton()
})

export const beatTutorial = playGameUsing({
  onStartMessage: 'Starting the tutorial...',
  onEndMessage: 'Tutorial over',
  beginGame: () => browserConnection.beginTutorial(),
  getStrategy: () => Promise.resolve('beatTutorial'),
  uponGameCompletion: () => browserConnection.clickExitGameButton()
})
