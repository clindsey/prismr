allLevels = require 'levels/all'
config = require 'config'
playerModel = require 'models/player'
tracker = require 'tracker'
ButtonView = require 'views/Button'

class LevelSelectScene
  constructor: ->
    @maxLevel = playerModel.getLevel()
    @el = new createjs.Container
    @createInstructionText()
    @createLevelButtons()
    tracker.track 'Level Select Scene', { @maxLevel }

  createInstructionText: ->
    instructionText = new createjs.Text "Select A Level", '26px Arial', '#333333'
    instructionText.x = 25
    instructionText.y = 25
    @el.addChild instructionText

  createLevelButtons: ->
    @buttonContainerEl = new createjs.Container
    @levelButtons = []
    buttonColumns = Math.floor (config.width - 22 * 2) / 56 + 1
    @buttonContainerEl.x = 22
    @buttonContainerEl.y = 65
    for index in [0...allLevels.length]
      ((index) =>
        isUnlocked = @maxLevel >= index
        callback = (=> ((index) => @onButtonClick(index))(index))
        unless isUnlocked
          callback = ->
        isSubdued = @maxLevel > index
        isSubdued = @maxLevel isnt index
        buttonView = new LevelButton index + 1, callback, isUnlocked, isSubdued
        buttonView.el.x = (index % buttonColumns) * 56 + 22
        buttonView.el.y = Math.floor((index / buttonColumns)) * 50 + 22
        @buttonContainerEl.addChild buttonView.el
        @levelButtons.push buttonView
      )(index)
    @el.addChild @buttonContainerEl

  onButtonClick: (index) =>
    sceneLocation = 'scenes/Play'
    options =
      level: index
    EventBus.dispatch '!scene:load', this, {sceneLocation, options}

  dispose: ->
    for levelButton in @levelButtons
      levelButton.dispose()

class LevelButton
  constructor: (@text, @callback, @isActive, @isSubdued) ->
    @width = 40
    @height = 30
    @color = '#888888'
    pulserActive = @isActive
    if @isActive
      @color = '#f58c22'
      if @isSubdued
        @color = '#e65e4c'
        pulserActive = false
    @el = new createjs.Container
    @timestops = [200, 1200]
    @scaleSize = 1.5
    @createBackground()
    if pulserActive
      @createScaleTween()
    @createText()

  createBackground: ->
    graphics = new createjs.Graphics
    graphics.c().f(@color).dr(0, 0, @width, @height).cp().ef()
    @backgroundEl = new createjs.Shape graphics
    @backgroundEl.regX = @width / 2
    @backgroundEl.regY = @height / 2
    @el.addChild @backgroundEl
    @el.addEventListener 'click', @callback

  createText: ->
    @textEl = new createjs.Text "#{@text}", '26px Arial', '#ffffff'
    width = @textEl.getMeasuredWidth()
    height = @textEl.getMeasuredHeight()
    hitEl = new createjs.Shape
    hitEl.graphics.beginFill('#000000').drawRect 0, 0, @width, @height
    @textEl.hitArea = hitEl
    @textEl.regX = @width / 2
    @textEl.regY = @height / 2
    @textEl.x = @width / 2 - width / 2
    @textEl.y = @height / 2 - height / 2 - 2
    @el.addChild @textEl

  createScaleTween: ->
    @scaleTween = new createjs.Tween.get(@backgroundEl).to({scaleX: @scaleSize, scaleY: @scaleSize}, @timestops[0]).to({scaleX: 1, scaleY: 1}, @timestops[1])
    @scaleTween.loop = true

  dispose: ->
    @el.removeEventListener 'click', @callback

module.exports = LevelSelectScene
