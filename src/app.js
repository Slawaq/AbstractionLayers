'use strict'

import Router from './tool/router'
import Templater from './tool/templater'
import HttpResponseCache from './tool/HttpResponseCache'
import { parse as cookieParse, write as cookieWrite } from './tool/cookie'
import { jsonResponse, humanityJson, content, jsonContent } from './tool/enhancers'

import handlers from './handlers/'

export default logger => config => async fs => {
  let cache = new HttpResponseCache()
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

  // router.use(function * (req, res, next) {
  //   if (req.method === 'GET' && cache[req.url]) {
  //     res.end(cache.get(req.url))
  //   } else {
  //     next()
  //     if (req.method === 'GET' && req.statusCode === 200) {
  //       cache.update(req.url, req.result)
  //     }
  //   }
  // })

  handlers(logger)(config)(fs)(router)

  return ::router.route
}
