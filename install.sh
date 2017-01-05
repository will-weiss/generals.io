#!/bin/bash


check_for_java() {
  which java || {
    echo "Could not detect java. Download the JDK here:"
    echo "http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html"
    exit 1
  }
}

check_for_node6() {
  which node || {
    echo "Could not detect node. Download node v6 or higher here:"
    echo "https://nodejs.org/en/"
    exit 1
  }
}

# Instructions taken from here: http://webdriver.io/guide.html
install_chromedriver() {
  echo "Installing chromedriver..."
  platform=$(uname -s)

  if [[ "${platform}" = 'Darwin' ]]; then
    brew install chromedriver
  elif [[ "${platform}" = 'Linux' ]]; then
    echo "We only support macs for now" && exit 1
  else
    echo "We only support macs for now " && exit 1
  fi
  echo "chromedriver installed."
}

# Instructions taken from here: http://webdriver.io/guide.html
install_selenium() {
  echo "Installing selenium..."
  curl -O http://selenium-release.storage.googleapis.com/3.0/selenium-server-standalone-3.0.1.jar
  echo "selenium installed."
}

install_npm_packages() {
  echo "Installing npm packages..."
  npm install
  echo "npm packages installed."
}

install() {
  check_for_java
  check_for_node6
  echo "Installing chromedriver, selenium, and npm packages..."
  install_chromedriver &
  install_selenium &
  install_npm_packages &
  wait
  echo "chromedriver, selenium, and npm packages installed."
}

install
