import vantage = require('vantage')
import { beatTutorial, play1v1, playTutorial } from '../playGame'


const cli = vantage()

function runAction(action) {
  return function(args, callback) {
    action(this).then(callback, callback)
  }
}

cli
  .command('beat-tutorial')
  .description('Beats the tutorial')
  .action(runAction(beatTutorial))

cli
  .command('play-tutorial')
  .description('Plays the tutorial')
  .action(runAction(playTutorial))

cli
  .command('one-v-one')
  .description('Plays a 1v1 game')
  .action(runAction(play1v1))


cli
  .delimiter('dookiebot~$')
  .listen(8010)
  .show()


export default cli
