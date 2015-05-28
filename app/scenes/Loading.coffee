config = require 'config'

class LoadingScene
  constructor: (@options, @callbackFn) ->
    @el = new createjs.Container
    @el.addEventListener 'tick', @onTick
    @createLoadingText()
    @el.cache 0, 0, config.width, config.height
    @timer = undefined
    @onTick()

  createLoadingText: ->
    loadingEl = new createjs.Text 'Loading...', '26px Arial', '#333333'
    loadingEl.x = 10
    loadingEl.y = 10
    @el.addChild loadingEl

  onTick: =>
    return if @timer
    @timer = setTimeout =>
      @callbackFn @options
      @timer = undefined
    , 1000 / 2

  dispose: ->
    @el.uncache()
    createjs.Ticker.removeEventListener 'tick', @onTick

module.exports = LoadingScene
