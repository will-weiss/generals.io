import BrowserGame from './BrowserGame'
import playGame from './playGame'
import { getRandomOrderForLargestArmy } from './Strategy'
import vantage = require('vantage')


const cli = vantage()

cli
  .command('play-tutorial')
  .description('Plays the tutorial')
  .action(function(args, callback) {
    const connection = new BrowserGame()
    return playGame(connection, getRandomOrderForLargestArmy)
      .then(() => callback())
      .catch(callback)
  })


cli
  .delimiter('dookiebot~$')
  .listen(8010)
  .show()


process.on('unhandledRejection', err => console.error(err))
