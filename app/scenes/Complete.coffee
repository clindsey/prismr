config = require 'config'
playerModel = require 'models/player'
tracker = require 'tracker'
ButtonView = require 'views/Button'

class CompleteScene
  constructor: ({@level, @message, @success, @score}) ->
    @el = new createjs.Container
    @createOutcomeText()
    @createMessageText()
    @createButton()
    playerModel.setLevel @level
    tracker.track 'Complete Scene', { @success, @level, @message, @score }

  createMessageText: ->
    textEl = new createjs.Text @message, '26px Arial', '#333333'
    textEl.x = 10
    textEl.y = 20
    @el.addChild textEl

  createOutcomeText: ->
    text = 'You Won!'
    unless @success
      text = 'You Lost!'
    textEl = new createjs.Text text, '26px Arial', '#333333'
    textEl.x = 10
    textEl.y = 90
    @el.addChild textEl

  createButton: ->
    text = 'Next Level'
    unless @success
      text = 'Retry'
    @buttonView = new ButtonView text, @onNextClick
    @buttonView.el.x = config.width / 2 - @buttonView.width / 2
    @buttonView.el.y = 190
    @el.addChild @buttonView.el

  onNextClick: =>
    sceneLocation = 'scenes/Play'
    options =
      level: @level
    EventBus.dispatch '!scene:load', this, {sceneLocation, options}

  dispose: ->
    #@buttonEl.removeEventListener 'click', @onNextClick
    @buttonView.dispose()

module.exports = CompleteScene
