import vantage = require('vantage')
import playTutorial from './playTutorial'


const cli = vantage()


cli
  .command('play-tutorial')
  .description('Plays the tutorial')
  .action(playTutorial)


cli
  .delimiter('dookiebot~$')
  .listen(8010)
  .show()


process.on('unhandledRejection', err => console.error(err))
