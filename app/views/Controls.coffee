utils = require 'utils'
config = require 'config'
tracker = require 'tracker'
PrismButtonView = require 'views/PrismButton'

SPRITE_SHEET_OPTIONS =
  images: [utils.loadQueue.getResult 'tileset']
  frames:
    width: config.tileWidth * config.devicePixelRatio
    height: config.tileHeight * config.devicePixelRatio
    spacing: 2 * config.devicePixelRatio
    margin: 1 * config.devicePixelRatio
  animations:
    red: 16
    orange: 17
    yellow: 18
    green: 19
    blue: 20
    violet: 21
    restart: 23

COLORS = [
  'red'
  'orange'
  'yellow'
  'green'
  'blue'
  'violet'
]

class ControlsView
  constructor: (@prismControlModel, @width, @height, @lowerOffset, @level) ->
    @score = 0
    @el = new createjs.Container
    @spriteSheet = new createjs.SpriteSheet SPRITE_SHEET_OPTIONS
    @colorIndex = 0
    @createPrismButtons()
    @createRestartButton()
    @createLevelIndicator()
    @createPointsIndicator()
    EventBus.addEventListener '!score:change', @onScoreChange, this

  onScoreChange: (event, {@score}) ->
    @updatePoints()

  createLevelIndicator: ->
    @textContainer = new createjs.Container
    textEl = new createjs.Text "Level #{@level + 1}", '26px Arial', '#333333'
    textHeight = textEl.getMeasuredHeight()
    textEl.x = 48
    textEl.y = (@height / 2) - (textHeight / 2)
    @textContainer.addChild textEl
    @textContainer.cache 0, 0, @width, @height
    @el.addChild @textContainer

  createPointsIndicator: ->
    @pointsContainer = new createjs.Container
    @scoreEl = new createjs.Text "Score: #{@score}", '26px Arial', '#333333'
    textWidth = @scoreEl.getMeasuredWidth()
    textHeight = @scoreEl.getMeasuredHeight()
    @scoreEl.x = @width - textWidth - 48
    @scoreEl.y = (@height / 2) - (textHeight / 2)
    @pointsContainer.addChild @scoreEl
    @pointsContainer.cache 0, 0, @width, @height
    @el.addChild @pointsContainer

  updatePoints: ->
    @scoreEl.text = "Score: #{@score}"
    textWidth = @scoreEl.getMeasuredWidth()
    @scoreEl.x = @width - textWidth - 48
    @pointsContainer.updateCache()

  createRestartButton: ->
    verticalSpacing = @height / 2
    offsetX = config.tileWidth / 2
    offsetY = config.tileHeight / 2
    hitEl = @createHitEl()
    @restartButtonEl = new createjs.Sprite @spriteSheet, 'restart'
    @restartButtonEl.scaleX = @restartButtonEl.scaleY = 1 / config.devicePixelRatio
    @restartButtonEl.x = @width - 48
    @restartButtonEl.y = verticalSpacing - offsetY + @lowerOffset
    @restartButtonEl.hitArea = hitEl
    @restartButtonEl.addEventListener 'click', @onRestartButtonClick
    @el.addChild @restartButtonEl

  createPrismButtons: ->
    @prismButtons = []
    @prismButtonsContainerEl = new createjs.Container
    verticalSpacing = @height / 2
    offsetX = 0
    offsetY = 0
    index = 0
    for colorName in COLORS
      ((colorName) =>
        callback = (=> ((colorName) => @onPrismButtonClick(colorName))(colorName))
        prismButtonView = new PrismButtonView colorName, callback
        prismButtonView.el.x = (@width / (6 + 2)) * (index + 1) + offsetX
        prismButtonView.el.y = verticalSpacing + offsetY + @lowerOffset
        @prismButtons.push prismButtonView
        @prismButtonsContainerEl.addChild prismButtonView.el
        index++
      )(colorName)
    @el.addChild @prismButtonsContainerEl

  createHitEl: ->
    hitEl = new createjs.Shape
    pos = (0 - 14) * config.devicePixelRatio
    size = 44 * config.devicePixelRatio
    hitEl.graphics.beginFill('#000000').drawRect pos, pos, size, size
    hitEl

  onRestartButtonClick: =>
    EventBus.dispatch '!game:restart', this

  onPrismButtonClick: (color) =>
    @prismControlModel.setColor color
    tracker.track 'Prism Button Click', { color, @level }

  dispose: ->
    @textContainer.uncache()
    @pointsContainer.uncache()
    EventBus.removeEventListener '!score:change', @onScoreChange, this
    for prismButtonView in @prismButtons
      prismButtonView.dispose()

module.exports = ControlsView
