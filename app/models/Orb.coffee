ORB_STATES =
  active: 'Active'
  idle: 'Idle'

SPECTRUM_COLORS = [
  'black'
  'red'
  'orange'
  'yellow'
  'green'
  'blue'
  'violet'
  'white'
]

class OrbModel
  constructor: (@color) ->
    @state = ORB_STATES.idle

  setActive: ->
    return if @state is ORB_STATES.active
    @state = ORB_STATES.active
    @onStateChange()

  setIdle: ->
    return if @state is ORB_STATES.idle
    @state = ORB_STATES.idle
    @onStateChange()

  upgrade: ->
    return if @color is 'white'
    nextIndex = SPECTRUM_COLORS.indexOf(@color) + 1
    nextColor = SPECTRUM_COLORS[nextIndex]
    @setColor nextColor

  downgrade: ->
    return if @color is 'black'
    previousIndex = SPECTRUM_COLORS.indexOf(@color) - 1
    previousColor = SPECTRUM_COLORS[previousIndex]
    @setColor previousColor

  setColor: (newColor) ->
    @color = newColor
    @onStateChange()
    if @color is 'black'
      EventBus.dispatch '!game:fail', this
      return

  onColorChange: ->
    # meant to be overridden by view

  dispose: ->

module.exports = OrbModel
