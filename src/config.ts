import { sample } from 'lodash'

const smallWords = require('fs').readFileSync('/usr/share/dict/words', 'utf8').split('\n').filter(word => word.length < 8)

export const botName = sample(smallWords) + '-' + sample(smallWords)
export const generalsIoUrl = 'http://generals.io'
export const webdriverOpts = { desiredCapabilities: { browserName: 'chrome' } }
export const viewportSize = { height: 4000, width: 4000 }
