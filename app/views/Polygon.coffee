config = require 'config'

class PolygonView
  constructor: (@model) ->
    @graphics = new createjs.Graphics
    @el = new createjs.Shape @graphics
    @el.x = model.x
    @el.y = model.y
    @plotVertices()

  plotVertices: ->
    vertices = @model.vertices
    return unless vertices.length
    if config.debug
      if @model.ignorePiP
        @graphics.beginStroke '#999999'
      else
        @graphics.beginFill '#999999'
    else
      if @model.ignorePiP
        @graphics.beginFill '#cccccc'
      else
        @graphics.beginFill '#9c9a94'
    @graphics.moveTo vertices[0].x, vertices[0].y
    for index in [1..vertices.length - 1]
      vertex = vertices[index]
      @graphics.lineTo vertex.x, vertex.y
    @graphics.lineTo vertices[0].x, vertices[0].y

  dispose: ->

module.exports = PolygonView
