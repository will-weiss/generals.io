import { appendFile } from 'fs'


const replayFilePath = __dirname + '/../replays'

export function logReplay(replayUrl: string): Promise<void> {
  return new Promise((resolve, reject) =>
    appendFile(replayFilePath, replayUrl + '\n', 'utf8', err => { err ? reject(err) : resolve() })) as any
}
