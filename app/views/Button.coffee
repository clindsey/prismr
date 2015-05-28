PulserView = require 'views/Pulser'

class ButtonView
  constructor: (@text, @callback, @isActive = true, @isSubdued = false) ->
    @el = new createjs.Container
    @buildText()
    @buildPulser()
    @el.addEventListener 'click', @callback

  buildPulser: ->
    currentColor = '#888888'
    pulserActive = @isActive
    if @isActive
      currentColor = '#f58c22'
      if @isSubdued
        currentColor = '#e65e4c'
        pulserActive = false
    @pulserView = new PulserView @width, @height, currentColor, [200,1200], 1.2, pulserActive
    @pulserView.el.x = @width / 2
    @pulserView.el.y = @height / 2 + 4
    @el.addChild @pulserView.el
    @el.swapChildren @pulserView.el, @textEl

  buildText: ->
    @textEl = new createjs.Text "#{@text}", '26px Arial', '#ffffff'
    @width = @textEl.getMeasuredWidth()
    @height = @textEl.getMeasuredHeight()
    hitEl = new createjs.Shape
    hitEl.graphics.beginFill('#000000').drawRect 0, 0, @width, @height
    @textEl.hitArea = hitEl
    @el.addChild @textEl

  dispose: ->
    @pulserView.dispose()
    @el.removeEventListener 'click', @callback

module.exports = ButtonView
