utils = require 'utils'
config = require 'config'

SPECTURM_COLORS =
  black: '#000000'
  white: '#ffffff'
  red: '#e65e4c'
  orange: '#f58c22'
  yellow: '#e6d822'
  green: '#86eb95'
  blue: '#85c0ff'
  violet: '#995db3'
  blackIdle: '#000000'
  whiteIdle: '#ffffff'
  redIdle: '#b8311f'
  orangeIdle: '#c75d00'
  yellowIdle: '#b8a500'
  greenIdle: '#5bbd66'
  blueIdle: '#5f8ccf'
  violetIdle: '#693185'

class OrbView
  constructor: (@model) ->
    @graphics = new createjs.Graphics
    @el = new createjs.Container
    @size = 16
    @scaleSize = 1.5
    @timestops = [200, 1200]
    @setRipplerView()
    @shapeEl = new createjs.Shape @graphics
    @el.addChild @shapeEl
    @isDanger = false
    @isActive = false
    #@setScaleTween()
    @setGraphics()
    @onStateChange()
    @model.onStateChange = => @onStateChange()
    EventBus.addEventListener '!orb:activeColors', @onOrbActiveColors, this

  setRipplerView: ->
    @ripplerView = new RipplerView [255, 255, 255], [204, 204, 204], @size, @timestops
    @el.addChild @ripplerView.el

  onOrbActiveColors: (_event, {activeColors}) ->
    activeColor = activeColors[@model.color]
    return unless activeColor
    oldDanger = @isDanger
    oldActive = @isActive
    @isDanger = activeColor.isDanger
    @isActive = activeColor.active
    if oldDanger isnt @isDanger or oldActive isnt @isActive
      @ripplerView.timeline.setPaused true
      if @isActive and !@isDanger
        @ripplerView.timeline.setPaused false
      else
        @ripplerView.el.scaleX = @ripplerView.el.scaleY = 0
      @setGraphics()

  setScaleTween: ->
    @scaleTween = createjs.Tween.get(@shapeEl).to({scaleX: @scaleSize, scaleY: @scaleSize}, @timestops[0]).to({scaleX: 1, scaleY: 1}, @timestops[1])
    @scaleTween.loop = true

  setGraphics: ->
    @shapeEl.scaleX = @shapeEl.scaleY = 1
    colorName = @model.color
    if @model.state is 'Idle'
      colorName = "#{@model.color}Idle"
      @shapeEl.visible = false
    else
      @shapeEl.visible = true
    color = SPECTURM_COLORS[colorName]
    radius = @size / 2
    @graphics.c()
    @graphics.s('#000000').ss(0.5)
    if @model.color isnt 'white'
      @graphics.s('#000000').ss(0.5)
    if @isDanger and @isActive
      @graphics.s('#ff0000').ss(3)
    @graphics.f(color).dc(0, 0, radius).cp().ef()

  onStateChange: ->
    @setGraphics()

  dispose: ->
    EventBus.removeEventListener '!orb:activeColors', @onOrbActiveColors, this

class RipplerView
  constructor: (startingColor, endingColor, @size, @timestops) ->
    @graphics = new createjs.Graphics
    @el = new createjs.Shape @graphics
    @startingColor = {r, g, b} = startingColor
    @endingColor = {r, g, b} = endingColor
    @currentColor = @startingColor
    @setGraphics()
    @setTimeline()
    createjs.Ticker.addEventListener 'tick', @setGraphics.bind this

  setTimeline: ->
    @setScaleTween()
    @setColorTween()
    @timeline = new createjs.Timeline [@scaleTween, @colorTween], {}, {loop: true}

  setColorTween: ->
    t = new createjs.Tween.get(@currentColor)
    t = t.to @endingColor, @timestops[1]
    t = t.to @startingColor, 0
    @colorTween = t

  setScaleTween: ->
    t = new createjs.Tween.get(@el)
    t = t.to {scaleX: 3, scaleY: 3}, @timestops[1]
    t = t.to {scaleX: 1, scaleY: 1}, 0
    @scaleTween = t

  setGraphics: ->
    [r, g, b] = @currentColor
    color = utils.rgbToHex r, g, b
    g = @graphics
    g.c()
    g.s color
    g.ss 2
    g.dc 0, 0, @size / 2
    g.cp()

module.exports = OrbView

