import BrowserGame from './BrowserGame'
import playGame from './playGame'
import * as Strategy from './Strategy'

const strategies = Object.keys(Strategy)

export default function playTutorial(args, callback): void {
  this.prompt([
    {
      type: 'list',
      name: 'strategy',
      message: 'Choose a strategy: ',
      choices: strategies
    }
  ], ({ strategy }) => {
    const connection = new BrowserGame()
    console.log('Starting the tutorial...')
    return playGame(connection, Strategy[strategy])
      .then(finalState => console.log('Tutorial over', finalState), callback())
      .catch(callback)
  })
}
