import vantage = require('vantage')
import browserConnection from '../browserConnection'
import { logReplayUrl } from '../logging'
import { beatTutorial, play1v1, playTutorial, playFFA, playFFARandomly } from '../playGame'


async function getReplays(): Promise<void> {
  const replays = await browserConnection.getReplays()
  replays.forEach(logReplayUrl)
}

const cli = vantage()

function runAction(action) {
  return function(args, callback) {
    action(this).then(callback, callback)
  }
}

async function loopFFA(cli): Promise<void> {

  try {
    await beatTutorial(cli)
    await browserConnection.waitForMainPage()
  } catch (err) {
    console.error(err)
  }

  while (true) {
    try {
      await playFFARandomly(cli)
      await browserConnection.waitForMainPage()
    } catch (err) {
      console.error(err)
    }
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
  .command('ffa')
  .description('Plays a FFA game')
  .action(runAction(playFFA))

cli
  .command('replays')
  .description('Gets urls of replays')
  .action(runAction(getReplays))

cli
  .command('loop')
  .description('Beats the tutorial, then plays FFA games, scraping replays until closed')
  .action(runAction(loopFFA))


export default cli
