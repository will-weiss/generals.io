#!/bin/bash

platform=$(uname -s)

check_for_selenium_server() {
  if [[ "${platform}" = 'Darwin' ]]; then
    [[ ! -z $(lsof -i tcp:4444) ]]
  elif [[ "${platform}" = 'Linux' ]]; then
    [[ ! -z $(netstat -anp tcp | grep 4444) ]]
  else
    echo "LOL windows"
    exit 1
  fi
}

run() {
  if [[ check_for_selenium_server ]]; then
    npm run build && npm start
  else
    echo "Could not detect a running selenium server"
    echo "Run ./start-selenium.sh in a separate terminal window"
    exit 1
  fi
}

run
