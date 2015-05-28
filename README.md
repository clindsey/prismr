# clindsey/prismr

An HTML5 puzzle-solving game. Illuminate the orbs in the correct sequence to advance.

The color spectrum is `red`, `orange`, `yellow`, `green`, `blue`, `violet`.

Built with [EaselJS](http://www.createjs.com/#!/EaselJS).

## makefile tasks
* installing - `make install` will install npm modules and bower libraries
* compiling assets - `make build` to compile assets to `public/`
* development - `make live` compiles assets as you're developing, translating coffeescript
* deploying - `make package` minifies assets and `make deploy` publishes `public/` to [clindsey.github.io/prismr](http://clindsey.github.io/prismr)

## requirements
* `git`
* `node` version `^0.10.33`, [instructions](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)
* a webserver configured to serve `public/`

## application structure
* `app/index.coffee` - the kick-off point for the application
* `app/config.coffee` - defines core variables such as sprite sheet location and element to bind canvas
* `app/utils.coffee` - utility methods that are used in multiple places
* `app/scenes/` - scenes describe states such as menus and game levels
* `models/models/` - models contain the non-view related data of on-screen entities
* `views/views/` - views are what are displayed on-screen and only contain logic related to display

## committing code
* each code change should be for a single github issue
* create a branch for each fix, such as `git checkout -b orb-illumination-point-14`
* reference the github issue in the commit message, such as `sets correct illumination registration point, fixes #14`
* push to remote branch and create a pull request against master
* coffeescript should follow this [style guide](https://github.com/polarmobile/coffeescript-style-guide)

## bumping version
`make version SEMVER="0.1.0"` will set the version value in `app/config.coffee`

## license
[MIT License](http://opensource.org/licenses/MIT)
