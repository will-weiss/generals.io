import { appendFileSync } from 'fs'
import browserConnection from './browserConnection'


const replayFilePath = __dirname + '/../replays'

export async function logReplays(): Promise<void> {
  const replays = await browserConnection.getReplays()
  const toLog = replays.map(url => url + '\n').join('')
  appendFileSync(replayFilePath, toLog, 'utf8')
}
