config = require 'config'
LoadingScene = require 'scenes/Loading'

class StageView
  constructor: (canvasEl) ->
    @el = new createjs.Stage canvasEl
    @el.scaleX = @el.scaleY = config.devicePixelRatio
    createjs.Ticker.setFPS config.fps
    createjs.Ticker.useRAF = true
    createjs.Touch.enable @el
    @createBackground()
    @el.on 'stagemousemove', @onStageMouseMove
    @el.on 'stagemousedown', @onStageMouseDown
    createjs.Ticker.addEventListener 'tick', @doUpdate
    EventBus.addEventListener '!scene:load', @onSceneLoad, this
    unless config.isMobile
      @el.enableMouseOver 10

  createBackground: ->
    @backgroundEl = new createjs.Shape
    @backgroundEl.graphics.beginFill '#ffffff'
    @backgroundEl.graphics.drawRect 0, 0, config.width, config.height
    @el.addChild @backgroundEl

  onSceneLoad: (event, {sceneLocation, options}) ->
    @loadScene sceneLocation, options

  loadScene: (sceneLocation, options) ->
    @disposeScene @scene
    loadingScene = new LoadingScene {sceneLocation, options}, ({sceneLocation, options}) =>
      @disposeScene loadingScene
      Scene = require sceneLocation
      @scene = new Scene options
      @el.addChild @scene.el
    @el.addChild loadingScene.el

  doUpdate: =>
    @el.update()

  onStageMouseMove: ({stageX, stageY}) ->
    EventBus.dispatch '!mouse:move', {}, {stageX, stageY}

  onStageMouseDown: ({stageX, stageY}) ->
    EventBus.dispatch '!mouse:down', {}, {stageX, stageY}

  disposeScene: (scene) ->
    if scene
      @el.removeChild scene.el
      scene.dispose()

  dispose: ->
    @el.off 'stagemousemove', @onStageMouseMove
    createjs.Stage.disable @el
    @disposeScene @scene
    createjs.Ticker.removeEventListener 'tick', @doUpdate
    EventBus.removeEventListener '!scene:load', @onSceneLoad, this

module.exports = StageView
