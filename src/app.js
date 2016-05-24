'use strict'

import Router from './tool/router'
import Templater from './tool/templater'
import { parse as cookieParse, write as cookieWrite } from './tool/cookie'
import { jsonResponse, humanityJson, content, jsonContent } from './tool/enhancers'

import handlers from './handlers/'

export default logger => config => async fs => {
  let templates = await Templater.load(logger, config, fs)
  let templater = new Templater(logger, templates)

  let router = new Router(logger, {
    response: x => ({ 
      template: templater.enhanceHttpResponse(x),
      cookie: cookieWrite(x),
      json: jsonResponse(x),
      humanityJson: humanityJson(x)
    }),
    request: x => ({
      content: content(x),
      jsonContent: jsonContent(x),
      cookie: cookieParse(x)
    })
  })

  handlers(logger)(config)(fs)(router)

  return ::router.route
}
