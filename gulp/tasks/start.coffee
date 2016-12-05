config = require '../config'
plugins = require '../plugins'

babel = require './babel'
jade = require './jade'
stylus = require './stylus'


g = plugins.gulp
$ = plugins.$

g.task 'default', ()->
  process = undefined

  restart = ()->
    if process
      process.kill()

    process = plugins.spawn('gulp', ['start'], stdio:'inherit')

  plugins.gulp.watch 'gulp/**', restart
  restart()


g.task 'start', ()->
  $.watch config.file.js, ()->
    g.start babel.task.default
    g.start babel.task.es6

  $.watch "#{config.ws}/#{config.demo}/js/**/", ()->
    g.start babel.task.demo

  $.watch "#{config.ws}/#{config.demo}/jade/**/", ()->
    g.start jade.task.default

  $.watch "#{config.ws}/#{config.demo}/stylus/**", ()->
    g.start stylus.task.default





g.task 'build', ()->
  plugins.runSequence(
    babel.task.default, babel.task.demo, jade.task.default, stylus.task.default, babel.task.es6
  )