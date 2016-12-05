###
  Babel 2 JavaScript
###
config = require '../config'
plugins = require '../plugins'


# Task List
task =
  default: 'babel'
  demo: 'babel:demo'
  es6: 'es6'


# Settings Export
module.exports =
  task: task

# Settings Import
g = plugins.gulp
$ = plugins.$


# Compile
g.task task.default, ()->
  return g.src(config.file.js)
  .pipe $.plumber()
  .pipe $.babel(
#    presets: ['es2015']      # プリセット適用(babel-preset-es2015)
    presets: ['es2015-without-strict']    # use strictモードなし(babel-preset-es2015-without-strict)
    plugins: [["transform-es2015-classes", {loose: true}]]
  )
  .pipe g.dest "#{config.dest}/"
  .pipe $.uglify(
    compress:
      dead_code: false
    preserveComments: 'license'
  )
  .pipe $.rename(
    extname: '.min.js'
  )
  .pipe g.dest "#{config.dest}/"


# Demo
g.task task.demo, ()->
  return g.src("#{config.ws}/#{config.demo}/js/**/*.js")
  .pipe $.plumber()
  .pipe $.babel(
#    presets: ['es2015']      # プリセット適用(babel-preset-es2015)
    presets: ['es2015-without-strict']    # use strictモードなし(babel-preset-es2015-without-strict)
  )
  .pipe g.dest "#{config.demo}/js/"

# ES6用
g.task task.es6, ()->
  return g.src(config.file.js)
  .pipe $.plumber()
  .pipe $.replace "class verticalScroller {", "export default class verticalScroller {"
  .pipe $.rename(
      basename: 'jquery.verticalScroller'
      suffix: '.noRequireJquery'
      extname: '.es6.js'
  )
  .pipe g.dest "#{config.dest}/"
  .pipe $.wrapper(
      header: "const $ = require(\'jquery\');\n"
  )
  .pipe $.rename(
    basename: 'jquery.verticalScroller'
    suffix: '.requireJquery'
    extname: '.es6.js'
  )
  .pipe g.dest "#{config.dest}/"


