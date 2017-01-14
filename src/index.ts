import cli from './cli'

cli
  .delimiter('dookiebot~$')
  .listen(5001)
  .show()


process.on('unhandledRejection', err => console.error(err))
