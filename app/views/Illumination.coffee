VisibilityLib = require 'lib/Visibility'
utils = require 'utils'
config = require 'config'

alpha = 1
if config.debug
  alpha = 0.1

SPECTURM_COLORS =
  red: [230, 94, 76, alpha]
  orange: [245, 140, 34, alpha]
  yellow: [230, 216, 34, alpha]
  green: [134, 235, 149, alpha]
  blue: [133, 192, 255, alpha]
  violet: [153, 93, 179, alpha]
  black: [0, 0, 0, alpha]
  white: [255, 255, 255, alpha]

class IlluminationView
  constructor: (@polygonModels, @prismModel, @width, @height, @primaryColor = 'white') ->
    @g = new createjs.Graphics
    @el = new createjs.Shape @g
    @visibility = new VisibilityLib
    wallPoints = []
    for polygonModel in @polygonModels
      for index in [0...polygonModel.segments.length]
        segment = polygonModel.segments[index]
        wallPoints.push
          p1:
            x: segment.a.x
            y: segment.a.y
          p2:
            x: segment.b.x
            y: segment.b.y
    @visibility.loadMap @width, @height, 0, [], wallPoints
    #@drawVisibility()
    @currentColor = {}
    @currentColor.red = SPECTURM_COLORS[@primaryColor][0]
    @currentColor.green = SPECTURM_COLORS[@primaryColor][1]
    @currentColor.blue = SPECTURM_COLORS[@primaryColor][2]
    @currentColor.alpha = SPECTURM_COLORS[@primaryColor][3]
    EventBus.addEventListener '!prismControl:activate', @onPrismActivate, this

  currentColorToRGBA: ->
    red = @currentColor.red | 0
    green = @currentColor.green | 0
    blue = @currentColor.blue | 0
    alpha = @currentColor.alpha
    "rgba(#{red}, #{green}, #{blue}, #{alpha})"

  currentColorToHex: ->
    red = @currentColor.red | 0
    green = @currentColor.green | 0
    blue = @currentColor.blue | 0
    utils.rgbToHex red, green, blue

  onPrismActivate: (_event, {color}) ->
    [red, green, blue, alpha] = SPECTURM_COLORS[color]
    @currentColor = {red, green, blue, alpha}
    [red, green, blue, alpha] = SPECTURM_COLORS[@primaryColor]
    createjs.Tween.get(@currentColor).to({red, green, blue, alpha}, 1000).addEventListener('change', =>
      @drawVisibility false
      @el.updateCache()
    )

  drawVisibility: (doCalculations = true) ->
    if doCalculations
      @visibility.setLightLocation @prismModel.x ,@prismModel.y
      @visibility.sweep Math.PI
    paths = @computeVisibleAreaPaths @visibility.output
    @vertices = @visibility.output
    @g.c()
    @drawFloor paths.floor
    @drawWalls paths.walls
    @el.cache 0, 0, @width, @height

  interpretSvg: (path) ->
    i = 0
    while i < path.length
      if path[i] == 'M'
        @g.mt path[i + 1], path[i + 2]
        i += 2
      if path[i] == 'L'
        @g.lt path[i + 1], path[i + 2]
        i += 2
      i++

  computeVisibleAreaPaths: (output) ->
    path1 = []
    path2 = []
    path3 = []
    i = 0
    while i < output.length
      p1 = output[i]
      p2 = output[i + 1]
      if isNaN(p1.x) or isNaN(p1.y) or isNaN(p2.x) or isNaN(p2.y)
        i += 2
        continue
      path1.push 'L', p1.x, p1.y, 'L', p2.x, p2.y
      path2.push 'M', @prismModel.x, @prismModel.y, 'L', p1.x, p1.y, 'M', @prismModel.x, @prismModel.y, 'L', p2.x, p2.y
      path3.push 'M', p1.x, p1.y, 'L', p2.x, p2.y
      i += 2
    {
      floor: path1
      triangles: path2
      walls: path3
    }

  drawFloor: (path) ->
    currentColor = @currentColorToHex()
    @g.f currentColor
    @g.mt @prismModel.x, @prismModel.y
    @interpretSvg path
    @g.lt @prismModel.x, @prismModel.y
    @g.cp()

  drawWalls: (path) ->
    @g.s '#9c9a94'
    @g.ss 2
    @interpretSvg path
    @g.cp()

  dispose: ->
    EventBus.removeEventListener '!prismControl:activate', @onPrismActivate, this

module.exports = IlluminationView

