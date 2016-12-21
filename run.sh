#!/bin/bash

start_selenium_server() {
  java -jar -Dwebdriver.geckodriver.driver=./geckodriver selenium-server-standalone-3.0.1.jar &
}

run() {
  start_selenium_server && npm run build && npm start
}

run