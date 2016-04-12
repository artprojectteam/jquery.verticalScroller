###
  Stylus 2 CSS
###
config = require '../config'
plugins = require '../plugins'


# Task List
task =
  default: 'stylus'


# Settings Export
module.exports =
  task: task

# Settings Import
g = plugins.gulp
$ = plugins.$


# Demo
g.task task.default, ()->
  return g.src(["#{config.ws}/#{config.demo}/stylus/**/*.styl", "!#{config.ws}/#{config.demo}/stylus/**/_*.styl"])
  .pipe $.plumber()
  .pipe $.stylus()
  .pipe g.dest "#{config.demo}/css/"