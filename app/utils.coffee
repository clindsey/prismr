componentToHex = (c) ->
  hex = c.toString(16)
  if hex.length is 1 then '0' + hex else hex

utils =
  loadAssets: (loadManifest, callback) ->
    @loadQueue = new createjs.LoadQueue
    createjs.Sound.alternateExtensions = ['mp3']
    @loadQueue.installPlugin createjs.Sound
    @loadQueue.addEventListener 'complete', callback
    @loadQueue.loadManifest loadManifest

  rgbToHex: (r, g, b) ->
    r = r | 0
    g = g | 0
    b = b | 0
    "##{componentToHex r}#{componentToHex g}#{ componentToHex b}"

  getQueryVariable: (variable) ->
    return false if !window.location or !window.location.search
    query = window.location.search.substring 1
    vars = query.split '&'
    for v in vars
      [key, value] = v.split '='
      return value if key is variable
    false

  pointInPolygon: ([pointX, pointY], vertices) -> # https://github.com/substack/point-in-polygon/blob/master/index.js
    isInside = false
    i = 0
    j = vertices.length - 1
    while i < vertices.length
      iX = vertices[i].x
      iY = vertices[i].y
      jX = vertices[j].x
      jY = vertices[j].y
      intersect = ((iY > pointY) != (jY > pointY)) && (pointX < (jX - iX) * (pointY - iY) / (jY - iY) + iX)
      if intersect
        isInside = !isInside
      j = i++
    isInside

module.exports = utils
