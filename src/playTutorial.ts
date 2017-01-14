import connection from './connection'
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
  ], async ({ strategy }) => {
    await connection.loading
    console.log('Starting the tutorial...')
    connection.beginTutorial()
    return playGame(connection, Strategy[strategy])
      .then(finalState => console.log('Tutorial over', finalState), callback())
      .catch(callback)
  })
}
