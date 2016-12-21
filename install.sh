#!/bin/bash


check_for_java() {
  which java || {
    echo "Could not detect java. Download the JDK here:"
    echo "http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html"
    exit 1
  }
}

# Instructions taken from here: http://webdriver.io/guide.html
install_geckodriver() {
  echo "Installing geckodriver..."
  platform=$(uname -s)

  if [[ "${platform}" = 'Darwin' ]]; then
    curl -L https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-macos.tar.gz | tar xz
  elif [[ "${platform}" = 'Linux' ]]; then
    curl -L https://github.com/mozilla/geckodriver/releases/download/v0.11.1/geckodriver-v0.11.1-linux64.tar.gz | tar xz
  else
    echo "Installing geckodriver requires a mac or linux platform" && exit 1
  fi
  echo "geckodriver installed."
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
  echo "Installing geckodriver, selenium, and npm packages..."
  install_geckodriver &
  install_selenium &
  install_npm_packages &
  wait
  echo "geckodriver, selenium, and npm packages installed."
}

install
