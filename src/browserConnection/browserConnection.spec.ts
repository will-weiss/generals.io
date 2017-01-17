import { expect } from 'chai'
import { sandbox, stub, SinonStub, SinonSandbox } from 'sinon'
import webdriverio = require('webdriverio')
import scrapeCurrentStateScript from './scrapeCurrentStateScript'
import addCustomStylesScript from './addCustomStylesScript'
import { createBrowserConnection, BrowserConnection } from './index'
require('chai').use(require('sinon-chai'))


describe('browserConnection', () => {

  let testSandbox: SinonSandbox
  beforeEach(() => testSandbox = sandbox.create())
  afterEach(() => testSandbox.restore())

  describe('createBrowserConnection', () => {
    const browserMethods = [
      'click',
      'close',
      'execute',
      'getAttribute',
      'getText',
      'init',
      'isExisting',
      'isVisible',
      'keys',
      'refresh',
      'setValue',
      'setViewportSize',
      'url',
      'waitForVisible',
      'waitUntil',
    ]

    let browser: any
    let browserConnection: BrowserConnection

    function mockBrowserMethod() {
      const browser = this
      const toReturn: any = Object.create(browser)
      toReturn.then = cb => cb(browser)
      return toReturn
    }

    function createMockBrowser() {
      const browser = {}
      browserMethods.forEach(methodName => {
        browser[methodName] = function() { return }
        stub(browser, methodName, mockBrowserMethod)
      })
      return browser
    }

    beforeEach(async () => {
      browser = createMockBrowser()
      testSandbox.stub(webdriverio, 'remote', () => browser)
      browserConnection = await createBrowserConnection()
    })

    it('resolves with an object with the proper methods', async () => {
      const expectedFunctionNames = [
        'submitOrder',
        'beginTutorial',
        'beginFFAGame',
        'begin1v1Game',
        'exitGameAndWaitForMainPage',
        'waitForGameToEndExitAndGetReplay',
        'close',
      ]
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
      expect(browser.execute).to.have.deep.property('firstCall.args.0', addCustomStylesScript)
      expect(browser.execute).to.have.deep.property('secondCall.args.0', scrapeCurrentStateScript)
    })

    it('enters a name', () => {
      expect(browser.setValue).to.have.been.calledOnce
      expect(browser.setValue).to.have.deep.property('firstCall.args.0').that.is.a('string')
      expect(browser.setValue).to.have.deep.property('firstCall.args.1').that.is.a('string')
    })
  })
})
