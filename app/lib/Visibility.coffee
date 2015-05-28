# http://www.redblobgames.com/articles/visibility/
class Visibility
  constructor: ->
    @segments = []
    @endpoints = []
    @open = []
    @center = new Point 0, 0
    @output = []

  loadMap: (width, height, margin, blocks, walls) ->
    @segments = []
    @endpoints = []
    @loadEdgeOfMap width, height, margin
    for {x, y, r} in blocks
      @addSegment x - r, y - r, x - r, y + r
      @addSegment x - r, y + r, x + r, y + r
      @addSegment x + r, y + r, x + r, y - r
      @addSegment x + r, y - r, x - r, y - r
    for {p1, p2} in walls
      @addSegment p1.x, p1.y, p2.x, p2.y

  loadEdgeOfMap: (width, height, margin) ->
    @addSegment margin, margin, margin, height - margin # west
    @addSegment margin, height - margin, width - margin, height - margin # south
    @addSegment width - margin, height - margin, width - margin, margin # east
    @addSegment width - margin, margin, margin, margin # north

  addSegment: (x1, y1, x2, y2) ->
    segment = null
    p1 = new EndPoint 0, 0
    p1.segment = segment
    p1.visualize = true
    p2 = new EndPoint 0, 0
    p2.segment = segment
    p2.visualize = false
    segment = new Segment
    p1.x = x1
    p1.y = y1
    p2.x = x2
    p2.y = y2
    p1.segment = segment
    p2.segment = segment
    segment.p1 = p1
    segment.p2 = p2
    segment.d = 0
    @segments.push segment
    @endpoints.push p1
    @endpoints.push p2

  setLightLocation: (x, y) ->
    @center.x = x
    @center.y = y
    for segment in @segments
      dx = 0.5 * (segment.p1.x + segment.p2.x) - x
      dy = 0.5 * (segment.p1.y + segment.p2.y) - y
      segment.d = dx * dx + dy * dy
      segment.p1.angle = Math.atan2 segment.p1.y - y, segment.p1.x - x
      segment.p2.angle = Math.atan2 segment.p2.y - y, segment.p2.x - x
      dAngle = segment.p2.angle - segment.p1.angle
      dAngle += 2 * Math.PI if dAngle <= 0 - Math.PI
      dAngle -= 2 * Math.PI if dAngle > Math.PI
      segment.p1.begin = dAngle > 0
      segment.p2.begin = !segment.p1.begin

  sweep: (maxAngle = 999) ->
    @output = []
    @endpoints.sort endpointCompare
    @open = []
    beginAngle = 0
    for pass in [0...2]
      for p in @endpoints
        break if pass is 1 and p.angle > maxAngle
        currentOld = if @open.length is 0 then null else @open[0]
        if p.begin
          node = @open[0]
          nodeIndex = 0
          while node and segmentInFrontOf p.segment, node, @center
            nodeIndex++
            node = @open[nodeIndex]
          unless node
            @open.push p.segment
          else
            @open.splice nodeIndex, 0, p.segment
        else
          segmentIndex = @open.indexOf p.segment
          @open.splice segmentIndex, 1
        currentNew = if @open.length is 0 then null else @open[0]
        if currentOld isnt currentNew
          if pass is 1
            @addTriangle beginAngle, p.angle, currentOld
          beginAngle = p.angle

  addTriangle: (angle1, angle2, segment) ->
    p1 = @center
    p2 = new Point @center.x + Math.cos(angle1), @center.y + Math.sin(angle1)
    p3 = new Point 0, 0
    p4 = new Point 0, 0
    if segment
      p3.x = segment.p1.x
      p3.y = segment.p1.y
      p4.x = segment.p2.x
      p4.y = segment.p2.y
    else
      p3.x = @center.x + Math.cos(angle1) * 500
      p3.y = @center.y + Math.sin(angle1) * 500
      p4.x = @center.x + Math.cos(angle2) * 500
      p4.y = @center.y + Math.sin(angle2) * 500
    pBegin = lineIntersection p3, p4, p1, p2
    p2.x = @center.x + Math.cos angle2
    p2.y = @center.y + Math.sin angle2
    pEnd = lineIntersection p3, p4, p1, p2
    @output.push pBegin
    @output.push pEnd

class Block

class Point
  constructor: (@x, @y) ->

class EndPoint extends Point
  constructor: (x, y) ->
    super x, y
    @begin = false
    @angle = 0
    @visualize = false

class Segment

endpointCompare = (a, b) ->
  return 1 if a.angle > b.angle
  return 0 - 1 if a.angle < b.angle
  return 1 if !a.begin and b.begin
  return 0 - 1 if a.begin and !b.begin
  0

segmentInFrontOf = (a, b, relativeTo) ->
  A1 = leftOf a, interpolate b.p1, b.p2, 0.01
  A2 = leftOf a, interpolate b.p2, b.p1, 0.01
  A3 = leftOf a, relativeTo
  B1 = leftOf b, interpolate a.p1, a.p2, 0.01
  B2 = leftOf b, interpolate a.p2, a.p1, 0.01
  B3 = leftOf b, relativeTo
  return true if B1 is B2 and B2 isnt B3
  return true if A1 is A2 and A2 is A3
  return false if A1 is A2 and A2 isnt A3
  return false if B1 is B2 and B2 is B3
  false

lineIntersection = (p1, p2, p3, p4) ->
  s = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y))
  new Point p1.x + s * (p2.x - p1.x), p1.y + s * (p2.y - p1.y)

leftOf = (s, p) ->
  cross = (s.p2.x - s.p1.x) * (p.y - s.p1.y) - (s.p2.y - s.p1.y) * (p.x - s.p1.x)
  cross < 0

interpolate = (p, q, f) ->
  new Point p.x * (1 - f) + q.x * f, p.y * (1 - f) + q.y * f

module.exports = Visibility

