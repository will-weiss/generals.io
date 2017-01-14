<<<<<<< HEAD
import vantage = require('vantage')
import { play1v1, playTutorial } from './playGame'


const cli = vantage()


cli
  .command('tutorial')
  .description('Plays the tutorial')
  .action(playTutorial)

cli
  .command('one-v-one')
  .description('Plays a 1v1 game')
  .action(play1v1)


cli
  .delimiter('dookiebot~$')
  .listen(8010)
  .show()
=======
import BrowserGame from './BrowserGame'
import playGame from './playGame'
import { earlyGame } from './Strategy'
import { VisibleGameInformation } from './types'


function main(): Promise<VisibleGameInformation> {
  const connection = new BrowserGame()
  return playGame(connection, earlyGame)
}
>>>>>>> 069d7a8... added the step away function in strategy


process.on('unhandledRejection', err => console.error(err))
