import { expect } from 'chai'
import { includes } from 'lodash'
import { sandbox, stub, SinonSandbox } from 'sinon'
import bluebird = require('bluebird')
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import addCustomStylesScript from './addCustomStylesScript'
import { createBrowserConnection, BrowserConnection } from './index'
require('chai').use(require('sinon-chai'))


describe('browserConnection', () => {

  // Create a sandbox that can override methods for the duration of each test, and restores them after each test
  let testSandbox: SinonSandbox
  beforeEach(() => testSandbox = sandbox.create())
  afterEach(() => testSandbox.restore())

  // Create references for the underlying browser and the browserConnection, which are created before each test
  let browser: any
  let browserConnection: BrowserConnection

  // These are all the browser methods we rely on
  const browserMethods = ['click', 'close', 'execute', 'getAttribute', 'getText', 'init', 'isExisting', 'isVisible',
    'keys', 'refresh', 'setValue', 'setViewportSize', 'url', 'waitForVisible', 'waitUntil']

  // A default mock implementation of a browser method, which is a thenable (like a promise), but also has the browser
  // as its prototype so that methods can be chained as in:
  // browser.init().url(generalsIoUrl)
  function mockBrowserMethod(): any {
    const browser = this
    const toReturn: any = Object.create(browser)
    toReturn.then = cb => cb(browser)
    return toReturn
  }

  // Adds or resets stubs for each browser method
  function stubOrResetBrowserMethods(): void {
    browserMethods.forEach(methodName => {
      browser[methodName] = () => { return }
      stub(browser, methodName, mockBrowserMethod)
    })
  }

  // Asserts that each of the other browser methods were not called
  function allMethodsButTheseWereNotCalled(methodsNotToCheck: string[]): void {
    browserMethods.forEach(methodName => {
      if (includes(methodsNotToCheck, methodName)) return
      expect(browser).to.have.property(methodName).not.to.be.called
    })
  }

  // Create a mock browser and a browser connection before each test
  beforeEach(async () => {
    browser = {}
    stubOrResetBrowserMethods()
    testSandbox.stub(webdriverio, 'remote', () => browser)
    browserConnection = await createBrowserConnection()
  })

  describe('createBrowserConnection', () => {
    it('resolves with an object with the proper methods', async () => {
      const expectedFunctionNames = ['beginTutorial', 'beginFFAGame', 'begin1v1Game', 'close',
        'exitGameAndWaitForMainPage', 'submitOrder', 'waitForGameToEndExitAndGetReplay']

      expect(browserConnection).to.have.all.keys(...expectedFunctionNames)
      expectedFunctionNames.forEach(functionName => {
        expect(browserConnection).to.have.property(functionName).that.is.a('function')
      })
    })

    it('connects to a remote selenium server using chromedriver', () => {
      expect(webdriverio.remote).to.have.been.calledOnce
      expect(webdriverio.remote).to.have.deep.property('firstCall.args.0.desiredCapabilities.browserName', 'chrome')
    })

    it('initializes', () => {
      expect(browser.init).to.have.been.calledOnce
    })

    it('sets the url', () => {
      expect(browser.url).to.have.been.calledOnce
      expect(browser.url).to.have.deep.property('firstCall.args.0', 'http://generals.io')
    })

    it('sets the viewport size', () => {
      expect(browser.setViewportSize).to.have.been.calledOnce
      expect(browser.setViewportSize).to.have.deep.property('firstCall.args.0.height').that.is.a('number')
      expect(browser.setViewportSize).to.have.deep.property('firstCall.args.0.width').that.is.a('number')
    })

    it('executes two scripts: addCustomStylesScript & scrapeCurrentStateScript', () => {
      expect(browser.execute).to.have.been.calledTwice
      expect(browser.execute.firstCall.args).to.deep.equal([addCustomStylesScript])
      expect(browser.execute.secondCall.args).to.deep.equal([scrapeCurrentStateScript])
    })

    it('enters a name', () => {
      expect(browser.setValue).to.have.been.calledOnce
      expect(browser.setValue).to.have.deep.property('firstCall.args.0', 'input[placeholder="Anonymous"]')
      expect(browser.setValue).to.have.deep.property('firstCall.args.1').that.is.a('string')
    })

    it('only called the methods outlined', () => {
      allMethodsButTheseWereNotCalled(['init', 'url', 'setViewportSize', 'execute', 'setValue'])
    })
  })

  describe('BrowserConnection', () => {
    // Reset all the stubs of browser methods so that we are only counting method calls from after the point the
    // connection has loaded
    beforeEach(stubOrResetBrowserMethods)

    describe('beginTutorial', () => {
      it('clicks the play button, waits for the game to start, zooms out, then scrapes and returns the first visible game information', async () => {
        // Mock that executing the scrapeCurrentState function will resolve with the visible game information
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // Begin tutorial and get the first visible game information
        const visibleGameInformation = await browserConnection.beginTutorial()

        // Assert that the play button was clicked
        expect(browser.click).to.have.been.calledOnce
        expect(browser.click).to.have.deep.property('firstCall.args.0', 'button.big')

        // Assert that the function waited for turn counter to be visible
        expect(browser.waitForVisible).to.have.been.calledOnce
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#turn-counter')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the function zoomed out by hitting the '9' key three times
        expect(browser.keys).to.have.been.calledThrice
        expect(browser.keys).to.have.deep.property('firstCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('secondCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('thirdCall.args.0', '9')

        // Assert that the browser was made to execute the scrapeCurrentState function loaded by the scrapeCurrentStateScript
        expect(browser.execute).to.have.been.calledOnce
        expect(browser.execute).to.have.deep.property('firstCall.args.0').that.is.a('function')
        const scraped = browser.execute.firstCall.args[0].call({ scrapeCurrentState: () => 'scraped' })
        expect(scraped).to.equal('scraped')

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible', 'keys', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })
    })

    describe('beginFFAGame', () => {
      it('clicks the play button, clicks the FFA button, waits for the game to start, zooms out, then scrapes and returns the first visible game information', async () => {
        // Mock that executing the scrapeCurrentState function will resolve with the visible game information
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // Begin tutorial and get the first visible game information
        const visibleGameInformation = await browserConnection.beginFFAGame()

        // Assert that the play button was clicked
        expect(browser.click).to.have.deep.property('firstCall.args.0', 'button.big')

        // Assert that the function waited for the game modes modal
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#game-modes')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the FFA button was clicked
        expect(browser.click).to.have.deep.property('secondCall.args.0', '#game-modes > center > button.inverted:first-of-type')

        // Assert that the function waited for turn counter to be visible
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.0', '#turn-counter')
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.1').that.is.a('number')

        // Assert that the function zoomed out by hitting the '9' key three times
        expect(browser.keys).to.have.been.calledThrice
        expect(browser.keys).to.have.deep.property('firstCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('secondCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('thirdCall.args.0', '9')

        // Assert that the browser was made to execute the scrapeCurrentState function loaded by the scrapeCurrentStateScript
        expect(browser.execute).to.have.been.calledOnce
        expect(browser.execute).to.have.deep.property('firstCall.args.0').that.is.a('function')
        const scraped = browser.execute.firstCall.args[0].call({ scrapeCurrentState: () => 'scraped' })
        expect(scraped).to.equal('scraped')

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible', 'keys', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })
    })

    describe('begin1v1Game', () => {
      it('clicks the play button, clicks the 1v1 button, waits for the game to start, zooms out, then scrapes and returns the first visible game information', async () => {
        // Mock that executing the scrapeCurrentState function will resolve with the visible game information
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // Begin tutorial and get the first visible game information
        const visibleGameInformation = await browserConnection.begin1v1Game()

        // Assert that the play button was clicked
        expect(browser.click).to.have.deep.property('firstCall.args.0', 'button.big')

        // Assert that the function waited for the game modes modal
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#game-modes')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the 1v1 button was clicked
        expect(browser.click).to.have.deep.property('secondCall.args.0', '#game-modes > center > button.inverted:first-of-type ~ button')

        // Assert that the function waited for turn counter to be visible
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.0', '#turn-counter')
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.1').that.is.a('number')

        // Assert that the function zoomed out by hitting the '9' key three times
        expect(browser.keys).to.have.been.calledThrice
        expect(browser.keys).to.have.deep.property('firstCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('secondCall.args.0', '9')
        expect(browser.keys).to.have.deep.property('thirdCall.args.0', '9')

        // Assert that the browser was made to execute the scrapeCurrentState function loaded by the scrapeCurrentStateScript
        expect(browser.execute).to.have.been.calledOnce
        expect(browser.execute).to.have.deep.property('firstCall.args.0').that.is.a('function')
        const scraped = browser.execute.firstCall.args[0].call({ scrapeCurrentState: () => 'scraped' })
        expect(scraped).to.equal('scraped')

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible', 'keys', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })
    })

    describe('submitOrder', () => {
      it('issues an order in which an army is not split', async () => {
        // Mock that executing the scrapeCurrentState function will resolve with the visible game information
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // An example order to submit
        const order = { from: { rowIndex: 0, colIndex: 0 }, to: { rowIndex: 0, colIndex: 1 }, splitArmy: false }
        const lastTurn = 5

        // Submit the order and get the visible game information
        const visibleGameInformation = await browserConnection.submitOrder(order, lastTurn)

        // Assert that the from tile was clicked first
        expect(browser.click.firstCall.args).to.deep.equal(['#map > tbody > tr:nth-child(1) > td:nth-child(1)'])

        // Assert that the to tile was clicked second
        expect(browser.click.secondCall.args).to.deep.equal(['#map > tbody > tr:nth-child(1) > td:nth-child(2)'])

        // Assert that the function waits for the order to resolve
        expect(browser.waitUntil).to.have.been.calledOnce
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.0').that.is.a('function')
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the current state was scraped
        expect(browser.execute).to.have.been.calledOnce

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitUntil', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })

      it('issues an order in which an army is split', async () => {
        // Setup browser stubs
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // An example order to submit
        const order = { from: { rowIndex: 0, colIndex: 0 }, to: { rowIndex: 0, colIndex: 1 }, splitArmy: true }
        const lastTurn = 5

        // Submit the order and get the visible game information
        const visibleGameInformation = await browserConnection.submitOrder(order, lastTurn)

        // Assert that the from tile was double clicked first
        expect(browser.click.firstCall.args).to.deep.equal(['#map > tbody > tr:nth-child(1) > td:nth-child(1)'])
        expect(browser.click.secondCall.args).to.deep.equal(['#map > tbody > tr:nth-child(1) > td:nth-child(1)'])

        // Assert that the to tile was clicked third (because of the earlier double click)
        expect(browser.click.thirdCall.args).to.deep.equal(['#map > tbody > tr:nth-child(1) > td:nth-child(2)'])

        // Assert that the function waits for the order to resolve
        expect(browser.waitUntil).to.have.been.calledOnce
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.0').that.is.a('function')
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the current state was scraped
        expect(browser.execute).to.have.been.calledOnce

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitUntil', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })

      it('waits for the turn to increment if no order is submitted', async () => {
        // Mock that executing the scrapeCurrentState function will resolve with the visible game information
        browser.execute = stub().returns(Promise.resolve({ value: 'VisibleGameInformation' }))

        // A non-order to submit
        const order = undefined
        const lastTurn = 5

        // Submit the order and get the visible game information
        const visibleGameInformation = await browserConnection.submitOrder(order, lastTurn)

        // Assert that there was no click
        expect(browser.click).to.not.have.been.called

        // Assert that the function waits for the turn to increment
        expect(browser.waitUntil).to.have.been.calledOnce
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.0').that.is.a('function')
        expect(browser.waitUntil).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the current state was scraped
        expect(browser.execute).to.have.been.calledOnce

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['waitUntil', 'execute'])

        // Assert that beginTutorial resolves with the visible game information
        expect(visibleGameInformation).to.equal('VisibleGameInformation')
      })
    })

    describe('exitGameAndWaitForMainPage', () => {
      it('clicks the exit game button then waits for the main page to be visible', async () => {
        await browserConnection.exitGameAndWaitForMainPage()

        // Assert that the exit game button was clicked
        expect(browser.click).to.have.been.calledOnce
        expect(browser.click.firstCall.args).to.deep.equal(['.alert > center > button.inverted:last-of-type'])

        // Assert that the function waited for the main page to be visible
        expect(browser.waitForVisible).to.have.been.calledOnce
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#main-menu')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible'])
      })
    })

    describe('waitForGameToEndExitAndGetReplay', () => {
      it('clicks the exit game button, waits for the main page to be visible, then gets the replay if it is already available', async () => {
        // Mock that the bluebird.delay never resolves when racing against refresh, but that it resolves immediately
        // when waiting for another attempt to get the replay
        const maxRefreshMilliseconds = 10 * 1000
        const refreshDelayMilliseconds = 30 * 1000
        const delay = testSandbox.stub(bluebird, 'delay')
        delay.withArgs(maxRefreshMilliseconds).returns(new Promise(resolve => { return }))
        delay.withArgs(refreshDelayMilliseconds).returns(Promise.resolve())

        // Mock that the replay link shows up immediately
        browser.isVisible = stub()
        browser.isVisible.onFirstCall().returns(Promise.resolve(true))

        // Mock that a getAttribute to retrieve href of the replay link
        browser.getAttribute = stub().returns(Promise.resolve('http://generals.io/replays/randomId'))

        // Call waitForGameToEndExitAndGetReplay and get the resulting replay
        const replay = await browserConnection.waitForGameToEndExitAndGetReplay()

        // Assert that the exit game button was clicked
        expect(browser.click.firstCall.args).to.deep.equal(['.alert > center > button.inverted:last-of-type'])

        // Assert that the function waited for the main page to be visible
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#main-menu')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the replay list button was clicked
        expect(browser.click.secondCall.args).to.deep.equal(['#replaylist-button'])

        // Assert that the function waited for the replays to be visible
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.0', '#replays')
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.1').that.is.a('number')

        // Assert that the href was retrieved from the replay link
        expect(browser.getAttribute).to.have.been.calledOnce
        expect(browser.getAttribute.firstCall.args).to.deep.equal(['#replays-table > tbody > tr > td > a', 'href'])

        // Assert that the exit replays button was clicked
        expect(browser.click.thirdCall.args).to.deep.equal(['#replays > button.small.inverted.center-horizontal'])

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible', 'getAttribute', 'isVisible'])

        // Assert that the url of the replay was returned
        expect(replay).to.equal('http://generals.io/replays/randomId')
      })

      it('clicks the exit game button, waits for the main page to be visible, then gets the replay after a refresh if the link is not immediately available', async () => {
        // Mock that the bluebird.delay never resolves when racing against refresh, but that it resolves immediately
        // when waiting for another attempt to get the replay
        const maxRefreshMilliseconds = 10 * 1000
        const refreshDelayMilliseconds = 30 * 1000
        const delay = testSandbox.stub(bluebird, 'delay')
        delay.withArgs(maxRefreshMilliseconds).returns(new Promise(resolve => { return }))
        delay.withArgs(refreshDelayMilliseconds).returns(Promise.resolve())

        // Mock that the replay link shows up only after a refresh
        browser.isVisible = stub()
        browser.isVisible.onFirstCall().returns(Promise.resolve(false))
        browser.isVisible.onSecondCall().returns(Promise.resolve(true))

        // Mock that a getAttribute to retrieve href of the replay link
        browser.getAttribute = stub().returns(Promise.resolve('http://generals.io/replays/randomId'))

        // Call waitForGameToEndExitAndGetReplay and get the resulting replay
        const replay = await browserConnection.waitForGameToEndExitAndGetReplay()

        // Assert that the exit game button was clicked
        expect(browser.click.firstCall.args).to.deep.equal(['.alert > center > button.inverted:last-of-type'])

        // Assert that the function waited for the main page to be visible
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.0', '#main-menu')
        expect(browser.waitForVisible).to.have.deep.property('firstCall.args.1').that.is.a('number')

        // Assert that the replay list button was clicked
        expect(browser.click.secondCall.args).to.deep.equal(['#replaylist-button'])

        // Assert that the function waited for the replays to be visible
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.0', '#replays')
        expect(browser.waitForVisible).to.have.deep.property('secondCall.args.1').that.is.a('number')

        // Assert that a refresh occured
        expect(browser.refresh).to.have.been.calledOnce

        // Assert that the replay list button was clicked again after the refresh
        expect(browser.click.thirdCall.args).to.deep.equal(['#replaylist-button'])

        // Assert that the function waited for the replays to be visible
        expect(browser.waitForVisible).to.have.deep.property('thirdCall.args.0', '#replays')
        expect(browser.waitForVisible).to.have.deep.property('thirdCall.args.1').that.is.a('number')

        // Assert that the href was retrieved from the replay link
        expect(browser.getAttribute).to.have.been.calledOnce
        expect(browser.getAttribute.firstCall.args).to.deep.equal(['#replays-table > tbody > tr > td > a', 'href'])

        // Assert that the exit replays button was clicked
        expect(browser.click.getCall(3).args).to.deep.equal(['#replays > button.small.inverted.center-horizontal'])

        // Assert that no other browser methods were called
        allMethodsButTheseWereNotCalled(['click', 'waitForVisible', 'getAttribute', 'isVisible', 'refresh'])

        // Assert that the url of the replay was returned
        expect(replay).to.equal('http://generals.io/replays/randomId')
      })
    })

    describe('close', () => {
      it('awaits browser.close', async () => {
        await browserConnection.close()
        expect(browser.close).to.have.been.calledOnce
        allMethodsButTheseWereNotCalled(['close'])
      })
    })
  })
})
