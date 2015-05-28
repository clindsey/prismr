PolygonModel = require 'models/Polygon'
PolygonView = require 'views/Polygon'
OrbModel = require 'models/Orb'
OrbView = require 'views/Orb'
IlluminationView = require 'views/Illumination'
PrismModel = require 'models/Prism'
PrismView = require 'views/Prism'
config = require 'config'
utils = require 'utils'
allLevels = require 'levels/all'

COLOR_ORDER = [
  'red'
  'orange'
  'yellow'
  'green'
  'blue'
  'violet'
]

class LevelView
  constructor: (@level, @width, @height, @prismControlModel) ->
    @score = 0
    @el = new createjs.Container
    @currentLevel = allLevels[@level]
    @createPolygons()
    @createPrism()
    @createOrbs()
    @createIllumination()
    @setDepths()
    @doDraw()
    @checkOrbIlluminations()
    @addEventListeners()

  addEventListeners: ->
    if config.isMobile
      EventBus.addEventListener '!mouse:move', @onMouseMove, this
    EventBus.addEventListener '!mouse:down', @onMouseDown, this
    EventBus.addEventListener '!prismControl:activate', @onPrismActivate, this

  onPrismActivate: ->
    activeColor = @prismControlModel.color
    offsetX = 0
    offsetY = 0
    allWhite = true
    pointsGained = 0
    orbsActivated = 0
    soundToPlay = false
    for orbView in @orbViews
      x = orbView.el.x + offsetX
      y = orbView.el.y + offsetY
      if utils.pointInPolygon [x, y], @illuminationView.vertices
        if orbView.model.color is activeColor
          pointsGained += 10
          if orbsActivated
            pointsGained += 5
          orbsActivated++
          orbView.model.upgrade()
          soundToPlay = 'select' if soundToPlay isnt 'error'
        else
          pointsGained -= 10
          orbView.model.downgrade()
          soundToPlay = 'error'
      if orbView.model.color isnt 'white'
        allWhite = false
    if allWhite
      EventBus.dispatch '!game:won', this
    if pointsGained isnt 0
      @score += pointsGained
      EventBus.dispatch '!score:change', this, {@score}
    @checkOrbIlluminations()
    if soundToPlay
      createjs.Sound.play soundToPlay

  setDepths: ->
    @el.swapChildren @prismView.el, @illuminationContainerEl

  checkOrbIlluminations: ->
    offsetX = 0
    offsetY = 0
    activeColors = {}
    for orbView in @orbViews
      x = orbView.el.x + offsetX
      y = orbView.el.y + offsetY
      activeColor = activeColors[orbView.model.color]
      isActive = false
      isVisible = false
      if utils.pointInPolygon [x, y], @illuminationView.vertices
        orbView.model.setActive()
        isActive = true
        isVisible = true
      else
        orbView.model.setIdle()
        isActive = false
      if activeColor
        activeColor.active = activeColor.active || isActive
      else
        activeColor = {active: isActive}
      activeColor.visible = isVisible
      activeColors[orbView.model.color] = activeColor
    lowestFound = COLOR_ORDER.length + 1
    for activeColor of activeColors
      index = COLOR_ORDER.indexOf activeColor
      if index < lowestFound
        lowestFound = index
    for activeColor of activeColors
      unless COLOR_ORDER.indexOf(activeColor) is lowestFound
        activeColors[activeColor].isDanger = true
      else
        activeColors[activeColor].isDanger = false
    EventBus.dispatch '!orb:activeColors', this, {activeColors}

  onMouseMove: (_event, {stageX, stageY}) ->
    stageX /= config.devicePixelRatio
    stageY /= config.devicePixelRatio
    @mouseInteraction stageX - @el.x, stageY - @el.y

  onPrismPressMove: ({stageX, stageY}) =>
    stageX /= config.devicePixelRatio
    stageY /= config.devicePixelRatio
    @mouseInteraction stageX - @el.x, stageY - @el.y

  onMouseDown: (_event, {stageX, stageY}) ->
    stageX /= config.devicePixelRatio
    stageY /= config.devicePixelRatio
    @mouseInteraction stageX - @el.x, stageY - @el.y

  mouseInPolygon: (mouseX, mouseY) ->
    for polygonModel in @polygonModels
      continue if polygonModel.ignorePiP
      pointX = mouseX - polygonModel.x
      pointY = mouseY - polygonModel.y
      return true if utils.pointInPolygon [pointX, pointY], polygonModel.vertices
    false

  mouseInteraction: (stageX, stageY) ->
    halfTileWidth = config.tileWidth / 2
    halfTileHeight = config.tileHeight / 2
    return if stageX <= halfTileWidth
    return if stageY <= halfTileHeight
    return if stageX >= @width - halfTileWidth
    return if stageY >= @height - halfTileHeight
    return if @mouseInPolygon stageX, stageY
    @prismModel.setPosition stageX, stageY
    @doDraw()
    @checkOrbIlluminations()

  doDraw: ->
    @illuminationView.drawVisibility()

  createPrism: ->
    [prismX, prismY] = @getPrismStartPosition()
    @prismModel = new PrismModel prismX, prismY, @prismControlModel
    @prismView = new PrismView @prismModel
    @prismView.el.x = @prismModel.x - config.tileWidth / 2
    @prismView.el.y = @prismModel.y - config.tileHeight / 2
    @el.addChild @prismView.el
    unless config.isMobile
      @prismView.el.addEventListener 'pressmove', @onPrismPressMove

  createIllumination: ->
    @illuminationContainerEl = new createjs.Container
    @illuminationView = new IlluminationView @polygonModels, @prismModel, @width, @height
    @illuminationContainerEl.addChild @illuminationView.el
    borderEl = new createjs.Shape
    borderEl.graphics.s('#e6e6e6').mt(0, 0).lt(@width, 0).mt(0, @height).lt(@width, @height)
    @illuminationContainerEl.addChild borderEl
    @el.addChild @illuminationContainerEl

  createPolygons: ->
    @polygonContainerEl = new createjs.Container
    @polygonViews = []
    @polygonModels = []
    @createBorder()
    @createObstacles()
    @el.addChild @polygonContainerEl
    @polygonContainerEl.cache 0, 0, @width, @height

  createOrbs: ->
    @orbContainer = new createjs.Container
    @addOrbs()
    @el.addChild @orbContainer

  addOrbs: ->
    @orbModels = []
    @orbViews = []
    for orb in @currentLevel.orbs
      orbModel = new OrbModel orb.color
      orbView = new OrbView orbModel
      [x, y] = @scalePoint orb.x, orb.y
      orbView.el.x = x
      orbView.el.y = y
      @orbContainer.addChild orbView.el
      @orbModels.push orbModel
      @orbViews.push orbView

  createBorder: ->
    @addPolygon 0, 0, [[0, 0], [@width, 0], [@width, @height], [0, @height]], true

  createObstacles: ->
    for obstacle in @currentLevel.obstacles
      vertices = @scaleVertices obstacle.vertices
      [x, y] = @scalePoint obstacle.x, obstacle.y
      @addPolygon x, y, vertices

  scaleVertices: (vertices) ->
    scaledVertices = []
    for vertex in vertices
      scaledVertex = @scalePoint vertex[0], vertex[1]
      scaledVertices.push scaledVertex
    scaledVertices

  getPrismStartPosition: ->
    @scalePoint @currentLevel.prism.x, @currentLevel.prism.y

  scalePoint: (x, y) ->
    levelWidth = @currentLevel.width
    levelHeight = @currentLevel.height
    scaledX = (x * @width) / levelWidth
    scaledY = (y * @height) / levelHeight
    [scaledX, scaledY]

  addPolygon: (x, y, vertices, ignorePiP = false) ->
    polygonModel = new PolygonModel x, y, vertices, ignorePiP
    polygonView = new PolygonView polygonModel
    if ignorePiP
      @polygonContainerEl.addChild polygonView.el
    @polygonViews.push polygonView
    @polygonModels.push polygonModel

  dispose: ->
    delete @currentLevel
    @illuminationView.dispose()
    polygonView.dispose() for polygonView in @polygonViews
    polygonModel.dispose() for polygonModel in @polygonModels
    for orbView in @orbViews
      orbView.model.dispose()
      orbView.dispose()
    if config.isMobile
      EventBus.removeEventListener '!mouse:move', @onMouseMove, this
    else
      @prismView.el.removeEventListener 'pressmove', @onPrismPressMove
    EventBus.removeEventListener '!mouse:down', @onMouseDown, this
    EventBus.removeEventListener '!prismControl:activate', @onPrismActivate, this
    @prismModel.dispose()
    @prismView.dispose()

module.exports = LevelView
