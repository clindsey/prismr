class PrismModel
  constructor: (@x, @y, @prismControlModel) ->
    @color = @prismControlModel.color

  setPosition: (@x, @y) ->
    @onPositionUpdate()

  onPositionUpdate: ->
    # meant to be overridden by view

  dispose: ->
    @onPositionUpdate = undefined

module.exports = PrismModel
