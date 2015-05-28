LevelView = require 'views/Level'
PrismControlModel = require 'models/PrismControl'
ControlsView = require 'views/Controls'
config = require 'config'
utils = require 'utils'
allLevels = require 'levels/all'
tracker = require 'tracker'

controlsWidth = config.width
controlsHeight = 48
levelY = controlsHeight
levelWidth = config.width
levelHeight = config.height - controlsHeight * 2

class PlayScene
  constructor: ({@level}) ->
    @el = new createjs.Container
    @createControls()
    @createLevel()
    @addEventListeners()
    tracker.track 'Play Scene', { @level }

  addEventListeners: ->
    EventBus.addEventListener '!game:won', @onGameWon, this
    EventBus.addEventListener '!game:fail', @onGameFail, this
    EventBus.addEventListener '!game:restart', @onGameRestart, this

  onGameRestart: ->
    sceneLocation = 'scenes/Play'
    options =
      level: @level
    clearTimeout @gameOverTimeout if @gameOverTimeout?
    EventBus.dispatch '!scene:load', this, {sceneLocation, options}
    tracker.track 'Game Restart', { @level }

  createLevel: ->
    @levelView = new LevelView @level, levelWidth, levelHeight, @prismControlModel
    @levelView.el.y = levelY
    @el.addChild @levelView.el

  createControls: ->
    @prismControlModel = new PrismControlModel 'violet'
    @controlsView = new ControlsView @prismControlModel, controlsWidth, controlsHeight, levelHeight + levelY, @level
    @el.addChild @controlsView.el

  onGameFail: ->
    sceneLocation = 'scenes/Complete'
    options =
      level: @level
      message: 'You created a black orb!'
      success: false
      score: @levelView.score
    clearTimeout @gameOverTimeout if @gameOverTimeout?
    @gameOverTimeout = setTimeout =>
      EventBus.dispatch '!scene:load', this, {sceneLocation, options}
    , 1000

  onGameWon: ->
    nextLevelIndex = @level + 1
    if nextLevelIndex >= allLevels.length
      nextLevelIndex = 0
    sceneLocation = 'scenes/Complete'
    options =
      level: nextLevelIndex
      message: 'All orbs are white!'
      success: true
      score: @levelView.score
    clearTimeout @gameOverTimeout if @gameOverTimeout?
    @gameOverTimeout = setTimeout =>
      EventBus.dispatch '!scene:load', this, {sceneLocation, options}
    , 1000

  dispose: ->
    @levelView.dispose()
    @prismControlModel.dispose()
    @controlsView.dispose()
    EventBus.removeEventListener '!game:won', @onGameWon, this
    EventBus.removeEventListener '!game:fail', @onGameFail, this
    EventBus.removeEventListener '!game:restart', @onGameRestart, this

module.exports = PlayScene
