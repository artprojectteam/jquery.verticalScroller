###
  Jade 2 HTML
###
config = require '../config'
plugins = require '../plugins'


# Task List
task =
  default: 'jade'


# Settings Export
module.exports =
  task: task

# Settings Import
g = plugins.gulp
$ = plugins.$


# Demo
g.task task.default, ()->
  return g.src("#{config.ws}/#{config.demo}/jade/**/*.jade")
  .pipe $.plumber()
  .pipe $.jade(
    pretty: true
  )
  .pipe g.dest "#{config.demo}/"