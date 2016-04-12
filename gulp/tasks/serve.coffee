###
  Local Server Instance
###
config = require '../config'
plugins = require '../plugins'
_bs = require 'browser-sync'


# Task List
task =
  default: 'serve'


# Settings Export
module.exports =
  task: task

# Settings Import
g = plugins.gulp


bs = _bs.create()


# Server
g.task task.default, ()->
  bs.init
    server:
      baseDir: ['./']
#    routers:
#      "/": "xxx"
    ghostMode:
      clicks: true
      scroll: true
      forms: true
    startPath: "/#{config.demo}"

  g.watch ["#{config.demo}/**", "#{config.dest}/#{config.target_file}"], ()->
    bs.reload()
