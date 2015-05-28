class PolygonModel
  constructor: (@x, @y, verticesArray, @ignorePiP = false) ->
    @vertices = verticesArray.map ([x, y]) ->
      {x, y}

    @computePointsAndSegments()

  computePointsAndSegments: ->
    [@points, @segments] = @gatherPointsAndSegments()

  computeSegments: ->
    segments = []
    return segments unless @vertices.length
    lastVertex = @vertices[0]
    for index in [1..@vertices.length - 1]
      vertex = @vertices[index]
      segments.push {a: lastVertex, b: vertex}
      lastVertex = vertex
    segments.push {a: lastVertex, b: @vertices[0]}
    segments

  gatherPointsAndSegments: ->
    segments = []
    points = []
    x = @x
    y = @y
    for segment in @computeSegments()
      pointA = segment.a
      pointB = segment.b
      absoluteA = {
        x: pointA.x + x
        y: pointA.y + y
      }
      absoluteB = {
        x: pointB.x + x
        y: pointB.y + y
      }
      segments.push {a: absoluteA, b: absoluteB}
    for vertex in @vertices
      points.push {x: x + vertex.x, y: y + vertex.y}
    [points, segments]

  dispose: ->

module.exports = PolygonModel
