import { BrowserConnection } from '../browserConnection'
import GameConfiguration from '../GameConfiguration'
import createGameState from '../GameState'
import { Order, Strategy, VisibleGameInformation } from '../types'
import * as Strategies from '../Strategy'
import { botName } from '../config'

type StrategyKey = keyof typeof Strategies

// const strategies: StrategyKey[] = Object.keys(Strategies) as any

interface GamePlayOpts {
  strategy: Strategy
  beginGame: (browserConnection: BrowserConnection) => Promise<VisibleGameInformation>
  uponGameCompletion: (browserConnection: BrowserConnection) => Promise<any>
}

// function promptUserForStrategy(cli): Promise<Strategy> {
//   const prompt = [{ type: 'list', name: 'strategyKey', message: 'Choose a strategy: ', choices: strategies }]
//   return new Promise(resolve => cli.prompt(prompt, ({ strategyKey }) => resolve(Strategies[strategyKey])))
// }

const playGameUsing = (opts: GamePlayOpts) => async (browserConnection: BrowserConnection) => {
  const firstVisibleGameInformation = await opts.beginGame(browserConnection)
  await playGameOnceStarted(browserConnection, firstVisibleGameInformation, opts.strategy)
  return opts.uponGameCompletion(browserConnection)
}


export async function playGameOnceStarted(
  browserConnection: BrowserConnection,
  firstVisibleGameInformation: VisibleGameInformation,
  strategy: Strategy
): Promise<void> {
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


// export const playFFA = playGameUsing({
//   beginGame: browserConnection => browserConnection.beginFFAGame(),
//   getStrategy: promptUserForStrategy,
//   uponGameCompletion: browserConnection => browserConnection.exitGameAndWaitForMainPage()
// })

// export const play1v1 = playGameUsing({
//   beginGame: browserConnection => browserConnection.begin1v1Game(),
//   getStrategy: promptUserForStrategy,
//   uponGameCompletion: browserConnection => browserConnection.exitGameAndWaitForMainPage()
// })

// export const playTutorial = playGameUsing({
//   beginGame: browserConnection => browserConnection.beginTutorial(),
//   getStrategy: promptUserForStrategy,
//   uponGameCompletion: browserConnection => browserConnection.exitGameAndWaitForMainPage()
// })

export const beatTutorial = playGameUsing({
  strategy: Strategies.beatTutorial,
  beginGame: browserConnection => browserConnection.beginTutorial(),
  uponGameCompletion: browserConnection => browserConnection.exitGameAndWaitForMainPage()
})

export const playFFARandomly = playGameUsing({
  strategy: Strategies.random,
  beginGame: browserConnection => browserConnection.beginFFAGame(),
  uponGameCompletion: browserConnection => browserConnection.waitForGameToEndExitAndGetReplay()
})
