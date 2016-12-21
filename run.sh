#!/bin/bash

platform=$(uname -s)

check_for_selenium_server() {
  if [[ "${platform}" = 'Darwin' ]]; then
    [[ ! -z $(lsof -i tcp:4444) ]]
  elif [[ "${platform}" = 'Linux' ]]; then
    [[ ! -z $(netstat -anp tcp | grep 3000) ]]
  else
    echo "LOL windows"
  fi
}

start_selenium_server() {
  java -jar -Dwebdriver.geckodriver.driver=./geckodriver selenium-server-standalone-3.0.1.jar &
}

wait_for_selenium_server() {
  check_for_selenium_server || {
    echo "waiting for selenium to boot..."
    sleep 1
    wait_for_selenium_server
  }
}

build_and_run() {
  npm run build && npm start
}

run() {
  if [[ check_for_selenium_server ]]; then
    build_and_run
  else
    start_selenium_server && wait_for_selenium_server && build_and_run
  fi
}

run
