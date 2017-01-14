import { expect } from 'chai'
import { range } from 'lodash'
import beatTutorial from './index'
import { initialTutorialVisibleGameInformation } from '../../sampleFirstTurnVisibleGameInformation'
import { Order, GameState } from '../../types'
import GameConfiguration from '../../GameConfiguration'
import createGameState from '../../GameState'


describe('beatTutorial', () => {
  it('gives the correct series of orders given the turn', () => {
    const config: GameConfiguration = new GameConfiguration('Anonymous', initialTutorialVisibleGameInformation)
    const initialState: GameState = createGameState(config, initialTutorialVisibleGameInformation)
    const { grid } = config.revealed
    const gameInfos = range(5).map(turn => ({ ...initialState, turn })).map(state => ({ config, state }))

    expect(beatTutorial(gameInfos[0])).to.deep.equal({ from: grid[3][5], to: grid[3][6], splitArmy: false })
    expect(beatTutorial(gameInfos[1])).to.deep.equal({ from: grid[3][6], to: grid[4][6], splitArmy: false })
    expect(beatTutorial(gameInfos[2])).to.deep.equal({ from: grid[4][6], to: grid[5][6], splitArmy: false })
    expect(beatTutorial(gameInfos[3])).to.deep.equal({ from: grid[5][6], to: grid[6][6], splitArmy: false })
    expect(beatTutorial(gameInfos[4])).to.deep.equal({ from: grid[6][6], to: grid[6][5], splitArmy: false })
  })

  it('throws an error for a turn number that is too high, because that shouldnt happen', () => {
    const config = new GameConfiguration('Anonymous', initialTutorialVisibleGameInformation)
    const state = { ...createGameState(config, initialTutorialVisibleGameInformation), turn: 100 }
    expect(() => beatTutorial({ config, state })).to.throw()
  })
})
