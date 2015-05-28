CanvasAdapter = require 'adapters/Canvas'
StageView = require 'views/Stage'
config = require 'config'
utils = require 'utils'
playerModel = require 'models/player'
tracker = require 'tracker'

utils.loadAssets config.loadManifest, ->
  canvasAdapter = new CanvasAdapter config.canvasAdapterOptions
  stageView = new StageView canvasAdapter.el
  unless playerModel.getLevel()?
    playerModel.setLevel 0
  sceneLocation = 'scenes/MainMenu'
  options = {}
  level = utils.getQueryVariable 'levelAnswer'
  if level
    sceneLocation = 'scenes/LevelBuilder'
    config.debug = true
    options.level = level - 1
  EventBus.dispatch '!scene:load', this, {sceneLocation, options}
  tracker.track 'Load Images'

tracker.register
  isMobile: config.isMobile
  width: config.width
  height: config.height
  namespace: config.namespace
  devicePixelRatio: config.devicePixelRatio
  isLevelAnswerScene: config.isLevelAnswerScene

tracker.track 'Page Load'
