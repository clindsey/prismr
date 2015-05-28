utils = require 'utils'

config =
  debug: false # different drawing rules for illumination
  development: true # level reset
  fps: 60
  tileWidth: 16
  tileHeight: 16
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test navigator.userAgent
  width: $(window).width()
  height: $(window).height()
  namespace: 'com.idlesync.prismr.0.5.0'
  devicePixelRatio: window.devicePixelRatio or 1
  loadManifest: []

config.loadManifest = [
  {id: 'error', src: 'sounds/ui-error-chime.ogg'}
  {id: 'select', src: 'sounds/ui-select-chime.ogg'}
  {id: 'tileset', src: "images/prismr-#{config.devicePixelRatio}x.png"}
]


unless config.isMobile
  if config.debug # worst-case scenario
    config.width = 320
    config.height = 480
  else
    config.width = 320
    config.height = 480

config.isLevelAnswerScene = utils.getQueryVariable 'levelAnswer'
if config.isLevelAnswerScene
  config.debug = true
  config.development = true
  config.width = 320
  config.height = 480 - 96

config.canvasAdapterOptions =
  selector: '#canvas-container'
  width: config.width
  height: config.height
  devicePixelRatio: config.devicePixelRatio

module.exports = config
