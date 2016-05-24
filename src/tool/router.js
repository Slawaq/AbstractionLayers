'use strict'

export default class Router {

  constructor (logger, enhancers = { }) {
    this.logger = logger
    this.enhancers = enhancers
    this.table = {
      get: { },
      post: { }
    }
  }

  route (req, res) {
    this.logger.info(`${new Date().toISOString()}: Incoming ${req.method}-request to ${req.url}`)

    let request = this.enhanceRequest(req)
    let response = this.enhanceResponse(res)
    let path = request.url
    let handler = this.table[request.method.toLowerCase()][path]

    if (handler) {
      this.handle(path, handler, request, response)
    } else {
      this.logger.error(`${path} doesn't have a handler!`)
      response.statusCode = 404
      response.template('404', { path })
    }
  }

  handle (path, handler, req, res) {
    try {
      let promise = handler(req, res)

      if (promise && promise.then && promise.catch) {
        promise.catch(err => this.handlerError(req, res, path, err))
      }
    } catch (err) {
      this.handlerError(req, res, path, err)
    }
  }

  handlerError (req, res, path, err) {
    res.statusCode = 500
    res.template('500', { error: err.stack })
    this.logger.error(`${path} handler has occurred an error!`, err)
  }

  get (path, handler) {
    this.table.get[path] = handler
    return this
  }

  post (path, handler) {
    this.table.post[path] = handler
    return this
  }

  enhanceResponse (res) {
    if (typeof this.enhancers.response === 'function') {
      let enhances = this.enhancers.response(res)
      Object
        .keys(enhances)
        .forEach(key => res[key] = enhances[key])
    }

    return res
  }

  enhanceRequest (req) {
    if (typeof this.enhancers.request === 'function') {
      let enhances = this.enhancers.request(req)
      Object
        .keys(enhances)
        .forEach(key => req[key] = enhances[key])
    }

    return req
  }

}
