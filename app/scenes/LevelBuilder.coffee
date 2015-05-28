config = require 'config'
utils = require 'utils'
PolygonModel = require 'models/Polygon'
PolygonView = require 'views/Polygon'
IlluminationView = require 'views/Illumination'
PrismModel = require 'models/Prism'
PrismView = require 'views/Prism'
OrbModel = require 'models/Orb'
OrbView = require 'views/Orb'
allLevels = require 'levels/all'

SPECTRUM_COLORS = [
  'red'
  'orange'
  'yellow'
  'green'
  'blue'
  'violet'
]

solutionColors = {
  'red': ['235,92,72,25', [230, 94, 76, 128]]
  'orange': ['240,117,54,48', [245, 140, 34, 128]]
  'yellow': ['240,147,45,68', [230, 216, 34, 128]]
  'green': ['220,167,69,86', [134, 235, 149, 128]]
  'blue': ['204,169,97,103', [133, 192, 255, 128]]
  'violet': ['197,158,109,118', [153, 93, 179, 128]]
}

class LevelBuilder
  constructor: ({level}) ->
    if level?
      @viewOnly = true
    @el = new createjs.Container
    @orbLookup = {}
    @illuminationLookup = {}
    @polygonModels = []
    @polygonLayerEl = new createjs.Container
    @el.addChild @polygonLayerEl
    @createBorder()
    @createPrism()
    @createOrbs()
    @createIlluminations()
    unless level?
      @doDraw()
    @setDepths()
    @addKeyboardEvents()
    if level?
      @loadLevel level

  loadLevel: (levelIndex) =>
    @currentLevel = allLevels[levelIndex]
    @width = config.width
    @height = config.height
    for polygonData in @currentLevel.obstacles
      @loadPolygon polygonData
    for orbData in @currentLevel.orbs
      [x, y] = @scalePoint orbData.x, orbData.y
      @loadOrb x, y, orbData.color
      color = orbData.color
      @illuminationLookup[color].el.visible = true
    @doDraw()

  addKeyboardEvents: ->
    console.log '`p` to add polygon'
    console.log '`l` to log level data'
    console.log '`1`-`6` to toggle orb illumination'
    console.log '`0` to toggle prism illumination'
    console.log '`s` to show solution regions'
    $(window).keypress (event) =>
      keyCode = event.keyCode
      if keyCode is 48 # prism illumination
        el = @illuminationViews[@illuminationViews.length - 1].el
        el.visible = !el.visible
      if 49 <= keyCode <= 54 # 1-6, orb illumination
        index = keyCode - 49
        el = @illuminationViews[index].el
        el.visible = !el.visible
      if keyCode is 108
        @logLevel()
      if keyCode is 112
        @createPolygon()
      if keyCode is 115
        @displaySolutions()

  displaySolutions: ->
    canvasWidth = config.width
    canvasHeight = config.height
    @illuminationContainerEl.cache 0, 0, config.width, config.height
    imageData = @illuminationContainerEl.cacheCanvas.getContext('2d').getImageData 0, 0, canvasWidth, canvasHeight
    bitmap = new Uint8ClampedArray(imageData.data)
    matchesFound = false
    for i in [0...bitmap.length] by 4
      r = bitmap[i + 0]
      g = bitmap[i + 1]
      b = bitmap[i + 2]
      a = bitmap[i + 3]
      keyFound = false
      for illuminationView in @illuminationViews
        unless illuminationView.el.visible
          continue
        orbModel = illuminationView.prismModel
        [key, solution] = solutionColors[orbModel.color]
        if key is "#{r},#{g},#{b},#{a}"
          matchesFound = true
          keyFound = true
          bitmap[i + 0] = solution[0]
          bitmap[i + 1] = solution[1]
          bitmap[i + 2] = solution[2]
          bitmap[i + 3] = solution[3]
      unless keyFound
        bitmap[i + 0] = 0
        bitmap[i + 1] = 0
        bitmap[i + 2] = 0
        bitmap[i + 3] = 0
    if matchesFound
      imageData.data.set bitmap
      @illuminationContainerEl.cacheCanvas.getContext('2d').putImageData imageData, 0, 0, 0, 0, canvasWidth, canvasHeight

  logLevel: ->
    level =
      width: config.width
      height: config.height
      prism:
        x: @prismModel.x
        y: @prismModel.y

    level.orbs  = []
    for illuminationView in @illuminationViews
      unless illuminationView.el.visible
        continue
      orbModel = illuminationView.prismModel
      orbView = orbModel.view
      level.orbs.push
        x: orbView.el.x
        y: orbView.el.y
        color: orbModel.color

    level.obstacles = []
    polygonModels = @polygonModels.slice()
    polygonModels.shift()
    level.obstacles = polygonModels.map (polygonModel) ->
      vertices = polygonModel.vertices.map ({x, y}) ->
        x = x | 0
        y = y | 0
        [x, y]
      {
        x: polygonModel.x
        y: polygonModel.y
        vertices
      }

    console.log JSON.stringify level

  loadPolygon: (polygonData) ->
    [x, y] = @scalePoint polygonData.x, polygonData.y
    vertices = @scaleVertices polygonData.vertices
    #polygonModel = new PolygonModel x, y, vertices
    polygonModel = new PolygonModel x, y, vertices
    @polygonModels.push polygonModel
    polygonView = new PolygonView polygonModel
    @polygonLayerEl.addChild polygonView.el
    ((polygonModel) =>
      polygonView.el.addEventListener 'pressmove', (event) =>
        polygonModel.x = event.stageX
        polygonModel.y = event.stageY
        polygonModel.computePointsAndSegments()
        event.target.x = event.stageX
        event.target.y = event.stageY
        @doDraw()
    )(polygonModel)

  createPolygon: ->
    vertices = []
    sides = (Math.random() * 2 + 3) | 0
    step = (Math.PI * 2) / sides

    vertices = []

    for side in [0..sides - 1]
      theta = (step * side) + (Math.random() * step)
      radius = Math.random() * 40 + 20
      vertices.push [(radius * Math.cos(theta)) | 0, (radius * Math.sin(theta)) | 0]

    polygonModel = new PolygonModel config.width / 2, config.height / 2, vertices
    @polygonModels.push polygonModel
    polygonView = new PolygonView polygonModel
    @polygonLayerEl.addChild polygonView.el
    ((polygonModel) =>
      polygonView.el.addEventListener 'pressmove', (event) =>
        polygonModel.x = event.stageX
        polygonModel.y = event.stageY
        polygonModel.computePointsAndSegments()
        event.target.x = event.stageX
        event.target.y = event.stageY
        @doDraw()
    )(polygonModel)

    @doDraw()

  scaleVertices: (vertices) ->
    scaledVertices = []
    for vertex in vertices
      scaledVertex = @scalePoint vertex[0], vertex[1]
      scaledVertices.push scaledVertex
    scaledVertices

  scalePoint: (x, y) ->
    levelWidth = @currentLevel.width
    levelHeight = @currentLevel.height
    scaledX = (x * @width) / levelWidth
    scaledY = (y * @height) / levelHeight
    [scaledX, scaledY]

  loadOrb: (x, y, color) ->
    orbModel = @orbLookup[color].model
    orbView = @orbLookup[color].view
    orbView.el.visible = true
    orbView.el.x = x
    orbView.el.y = y
    orbModel.x = x
    orbModel.y = y

  createOrbs: ->
    @orbModels = []
    @orbViews = []
    for color in SPECTRUM_COLORS.reverse()
      x = config.width / 2 - config.tileWidth / 2
      y = config.height - config.tileHeight
      orbModel = new PrismModel x, y, {color}
      orbView = new PrismView orbModel, color
      orbView.el.x = x
      orbView.el.y = y
      orbModel.view = orbView # lol
      if @viewOnly
        orbView.el.visible = false
      @orbViews.push orbView
      @el.addChild orbView.el
      ((orbModel) =>
        orbView.el.addEventListener 'pressmove', (event) =>
          orbModel.x = event.stageX
          orbModel.y = event.stageY
          event.target.x = orbModel.x
          event.target.y = orbModel.y
          @doDraw()
      )(orbModel)
      @orbModels.push orbModel
      @orbLookup[color] = {model: orbModel, view: orbView}

  setDepths: ->
    @el.swapChildren @illuminationContainerEl, @prismView.el

  mouseInteraction: (stageX, stageY) ->
    @prismModel.setPosition stageX, stageY
    @doDraw()

  doDraw: ->
    for illuminationView in @illuminationViews
      illuminationView.drawVisibility()
    clearTimeout @displaySolutionTimeout if @displaySolutionTimeout
    @displaySolutionTimeout = setTimeout =>
      @displaySolutions()
    , 1000

  createBorder: ->
    @addPolygon 0, 0, [[0, 0], [config.width, 0], [config.width, config.height], [0, config.height]], true

  createPrism: ->
    [prismX, prismY] = [config.width / 2, config.height / 2]
    @prismModel = new PrismModel prismX, prismY, {color: 'black'}
    @prismView = new PrismView @prismModel
    @prismView.el.x = @prismModel.x
    @prismView.el.y = @prismModel.y
    @el.addChild @prismView.el
    @prismView.el.addEventListener 'pressmove', @onPrismPressMove
    if @viewOnly
      @prismView.el.visible = false

  onPrismPressMove: (event) =>
    @mouseInteraction event.stageX, event.stageY

  addPolygon: (x, y, vertices, ignorePiP = false) ->
    polygonModel = new PolygonModel x, y, vertices, ignorePiP
    polygonView = new PolygonView polygonModel
    @polygonModels.push polygonModel
    @el.addChild polygonView.el

  createIlluminations: ->
    @illuminationViews = []
    @illuminationContainerEl = new createjs.Container
    for orbModel in @orbModels
      illuminationView = new IlluminationView @polygonModels, orbModel, config.width, config.height, orbModel.color
      @illuminationLookup[orbModel.color] = illuminationView
      illuminationView.el.visible = false
      @illuminationViews.push illuminationView
      @illuminationContainerEl.addChild illuminationView.el
    @illuminationViews = @illuminationViews.reverse()
    illuminationView = new IlluminationView @polygonModels, @prismModel, config.width, config.height, 'black'
    illuminationView.el.visible = false
    @illuminationViews.push illuminationView
    @illuminationContainerEl.addChild illuminationView.el
    @el.addChild @illuminationContainerEl

  dispose: ->

module.exports = LevelBuilder
