class PrismControlModel
  constructor: (@color) ->

  setColor: (@color) ->
    EventBus.dispatch '!prismControl:activate', this, {@color}

  dispose: ->

module.exports = PrismControlModel
