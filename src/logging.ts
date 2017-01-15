import { appendFileSync } from 'fs'

export function logReplayUrl(url: string): void {
  appendFileSync(__dirname + '/../replays', url, 'utf8')
}
