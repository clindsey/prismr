config = require 'config'

SPECTURM_COLORS =
  red: '#e65e4c'
  orange: '#f58c22'
  yellow: '#e6d822'
  green: '#86eb95'
  blue: '#85c0ff'
  violet: '#995db3'
  redIdle: '#a82311'
  orangeIdle: '#b84d00'
  yellowIdle: '#b8a200'
  greenIdle: '#4ead58'
  blueIdle: '#507fbf'
  violetIdle: '#5a2275'

class PrismButtonView
  constructor: (@colorName, @callback) ->
    @currentColor = @colorName
    @width = 16
    @height = 16
    @isActive = false
    @scaleSize = 1.5
    @isDanger = false
    @timestops = [200, 1200]
    @graphics = new createjs.Graphics
    @el = new createjs.Container
    @shapeEl = new createjs.Shape @graphics
    @shapeEl.regX = @width / 2
    @shapeEl.regY = @height / 2
    @setHitEl()
    @el.addChild @shapeEl
    @setScaleTween()
    @setTimeline()
    @setGraphics()
    @el.addEventListener 'click', @callback
    EventBus.addEventListener '!orb:activeColors', @onOrbActiveColors, this

  onOrbActiveColors: (_event, {activeColors}) ->
    newState = "#{@colorName}Idle"
    currColor = @currentColor
    oldDanger = @isDanger
    oldActive = @isActive
    activeColor = activeColors[@colorName]
    @isActive = false
    if activeColor
      if activeColor.active
        newState = @colorName
      @isDanger = activeColor.isDanger
      @isActive = activeColor.active
    @currentColor = newState
    if currColor isnt newState or @isDanger isnt oldDanger or @isActive isnt oldActive
      @timeline.setPaused true
      unless @isActive
        @shapeEl.scaleX = @shapeEl.scaleY = 1
      else
        @timeline.setPaused false
      @setGraphics()

  setTimeline: ->
    @timeline = new createjs.Timeline [@scaleTween], {}, {loop: true}

  setScaleTween: ->
    @scaleTween = createjs.Tween.get(@shapeEl).to({scaleX: @scaleSize, scaleY: @scaleSize}, @timestops[0]).to({scaleX: 1, scaleY: 1}, @timestops[1])

  setGraphics: ->
    color = SPECTURM_COLORS[@currentColor]
    @graphics.c()
    @graphics.s('#cccccc').ss(2)
    if @isActive
      @graphics.s(color).ss(2)
      if @isDanger
        @graphics.s('#ff0000').ss(2)
    @graphics.f(color).dr(0, 0, @width, @height).cp().ef()
    @graphics.es()

  setHitEl: ->
    width = config.width / 8 - 2
    hitEl = new createjs.Shape
    hitEl.graphics.beginFill('#000000').drawRect 0, 0, width, 44
    hitEl.regX = width / 2
    hitEl.regY = 22
    @el.hitArea = hitEl

  dispose: ->
    @el.removeEventListener 'click', @callback
    EventBus.removeEventListener '!orb:activeColors', @onOrbActiveColors, this

module.exports = PrismButtonView

