class PulserView
  constructor: (@width, @height, @color, @timestops, @scaleSize, @isActive = true) ->
    @width += 8
    @height += 8
    @shadowBlur = {size: 0}
    @graphics = new createjs.Graphics
    @el = new createjs.Shape @graphics
    @el.regX = @width / 2
    @el.regY = @height / 2
    @setGraphics()
    if @isActive
      @setScaleTween()

  setScaleTween: ->
    @scaleTween = createjs.Tween.get(@el).to({scaleX: @scaleSize, scaleY: @scaleSize}, @timestops[0]).to({scaleX: 1, scaleY: 1}, @timestops[1])
    @scaleTween.loop = true

  setGraphics: =>
    @graphics.c().f(@color).dr(0, 0, @width, @height).cp().ef()

  dispose: ->

module.exports = PulserView
