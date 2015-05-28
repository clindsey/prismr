utils = require 'utils'
config = require 'config'

SPRITE_SHEET_OPTIONS =
  images: [utils.loadQueue.getResult 'tileset']
  frames:
    width: config.tileWidth * config.devicePixelRatio
    height: config.tileHeight * config.devicePixelRatio
    spacing: 2 * config.devicePixelRatio
    margin: 1 * config.devicePixelRatio
  animations:
    main: 22
    black: 15
    red: 8
    orange: 9
    yellow: 10
    green: 11
    blue: 12
    violet: 13
    white: 14

class PrismView
  constructor: (@model, animation = 'main') ->
    @spriteSheet = new createjs.SpriteSheet @spriteSheetOptions
    @el = new createjs.Sprite @spriteSheet, animation
    @el.scaleX = @el.scaleY = 1 / config.devicePixelRatio
    hitEl = new createjs.Shape
    hitEl.graphics.beginFill('#000000').drawRect 0 - 14, 0 - 14, 44, 44
    @el.hitArea = hitEl
    @model.onPositionUpdate = @onPositionUpdate

  spriteSheetOptions: SPRITE_SHEET_OPTIONS

  onPositionUpdate: =>
    @el.x = @model.x - config.tileWidth / 2
    @el.y = @model.y - config.tileHeight / 2

  dispose: ->
    delete @model.onPositionUpdate

module.exports = PrismView
