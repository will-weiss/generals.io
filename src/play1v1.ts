import BrowserGame from './BrowserGame'
import playGame from './playGame'
import * as Strategy from './Strategy'

const strategies = Object.keys(Strategy)


export default function play1v1(args, callback): void {
  this.prompt([
    {
      type: 'list',
      name: 'strategy',
      message: 'Choose a strategy: ',
      choices: strategies
    }
  ], ({ strategy }) => {
    const connection = new BrowserGame()
    console.log('Starting a 1v1 game...')
  })
}
