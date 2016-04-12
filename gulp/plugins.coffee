echoColor =
  _reset: "\u001b[0m"
  black: "\u001b[30m"
  white: "\u001b[37m"
  red: "\u001b[31m"
  green: "\u001b[32m"
  yellow: "\u001b[33m"
  blue: "\u001b[34m"


# gulpモジュール
module.exports =
  gulp: require 'gulp'
  $: require('gulp-load-plugins')()   # 'gulp-'で始まるモジュールを自動でrequire
  spawn: require('child_process').spawn
  runSequence: require 'run-sequence'
  messages: (mes)->
    console.log "#{echoColor.yellow + mes + echoColor._reset}"

  completed: (tasks)->
    console.log "#{echoColor.blue}---task [#{tasks}] is Completion !!#{echoColor._reset}"
