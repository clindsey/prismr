config = require 'config'
utils = require 'utils'
playerModel = require 'models/player'
ButtonView = require 'views/Button'
tracker = require 'tracker'

LOGO_SPRITE_SHEET_OPTIONS =
  images: [utils.loadQueue.getResult 'tileset']
  frames:
    width: 163 * config.devicePixelRatio
    height: 35 * config.devicePixelRatio
  animations:
    logo: 3

class MainMenuScene
  constructor: ->
    @el = new createjs.Container
    @createLogo()
    @createPlayButton()
    if config.development
      @createProgressResetButton()
    tracker.track 'Main Menu Scene'

  createLogo: ->
    logoSpriteSheet = new createjs.SpriteSheet LOGO_SPRITE_SHEET_OPTIONS
    logoEl = new createjs.Sprite logoSpriteSheet, 'logo'
    logoEl.x = (config.width / 2) - (163 / 2)
    logoEl.y = 120
    logoEl.scaleX = logoEl.scaleY = 1 / config.devicePixelRatio
    @el.addChild logoEl

  createProgressResetButton: ->
    @progressResetButtonEl = new createjs.Text "[ Reset Progress ]", '26px Arial', '#880000'
    textWidth = @progressResetButtonEl.getMeasuredWidth()
    textHeight = @progressResetButtonEl.getMeasuredHeight()
    @progressResetButtonEl.x = (config.width / 2) - (textWidth / 2)
    @progressResetButtonEl.y = config.height - textHeight - 48
    hitEl = new createjs.Shape
    hitEl.graphics.beginFill('#000000').drawRect 0, 0, textWidth, textHeight
    @progressResetButtonEl.hitArea = hitEl
    @el.addChild @progressResetButtonEl
    @progressResetButtonEl.addEventListener 'click', @onProgressResetClick
    currentLevel = playerModel.getLevel()
    unless currentLevel
      @progressResetButtonEl.visible = false

  createPlayButton: ->
    @playButton = new ButtonView 'Press To Play', @onPlayClick
    @playButton.el.x = (config.width / 2) - (@playButton.width / 2)
    @playButton.el.y = (config.height / 2) - (@playButton.height / 2)
    @el.addChild @playButton.el

  onPlayClick: =>
    sceneLocation = 'scenes/LevelSelect'
    options = {}
    EventBus.dispatch '!scene:load', this, {sceneLocation, options}

  onProgressResetClick: =>
    playerModel.setLevel 0, true
    @progressResetButtonEl.visible = false

  dispose: ->
    @playButton.dispose()
    if config.development
      @progressResetButtonEl.removeEventListener 'click', @onProgressResetClick

module.exports = MainMenuScene
