config = require 'config'

class PlayerModel
  constructor: ->

  setLevel: (level, override) ->
    if (level > @getLevel()) or override
      localStorage.setItem "#{config.namespace}.level", level

  getLevel: ->
    parseInt localStorage.getItem("#{config.namespace}.level") || 0, 10

  dispose: ->

module.exports = new PlayerModel
