import { createBrowserConnection } from './browserConnection'
import { logReplay } from './logging'
import { beatTutorial, playFFARandomly } from './playGame'


async function playOnce(): Promise<void> {
  const browserConnection = await createBrowserConnection()
  await beatTutorial(browserConnection)
  const replayUrl = await playFFARandomly(browserConnection)
  await logReplay(replayUrl)
  await browserConnection.close()
}

async function loopPlay(): Promise<void> {
  while (true) await playOnce()
}

loopPlay()

// cli.delimiter(`${botName}~$`).show()

process.on('unhandledRejection', err => console.error(err))
