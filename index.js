'use strict'

import http from 'http'
import { Logger, transports } from 'winston'

import { config } from '../package.json'
import app from './src/app'
import FileSystem from './src/tool/fs'

let fs = new FileSystem()
let logger = new Logger({
  transports: [ new transports.Console() ]
})

app(logger)(config)(fs)
  .then(http.createServer)
  .then(x => x.listen(config.port))
  .catch(::logger.error)
