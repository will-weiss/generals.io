import connection from './connection'
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
  ], async ({ strategy }) => {
    await connection.loading
    console.log('Starting a 1v1 game...')
    connection.begin1v1Game()
    return playGame(connection, Strategy[strategy])
      .then(finalState => console.log('Game over', finalState), callback())
      .catch(callback)
  })
}
