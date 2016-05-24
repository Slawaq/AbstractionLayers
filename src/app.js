'use strict'

import Router from './tool/router'
import Templater from './tool/templater'
import { parse as cookieParse, write as cookieWrite } from './tool/cookie'

import loadTemplates from './loadTemplates'
import handlers from './handlers/'

export default logger => config => async fs => {
  let templates = await Templater.load(logger, config, fs)
  let templater = new Templater(logger, templates)

  let router = new Router(logger, {
    response: x => ({ 
      template: templater.enhanceHttpResponse(x),
      cookie: cookieWrite(x)
    }),
    request: x => ({
      cookie: cookieParse(x)
    })
  })

  handlers(logger)(config)(fs)(router)

  return ::router.route
}
