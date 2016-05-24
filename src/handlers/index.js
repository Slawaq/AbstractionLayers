'use strict'

import person from './person'

let index = (req, res) => {
  res.cookie({ strawberry: 'cookie!' })
  res.template('index', {
    ip: req.connection.remoteAddress,
    cookies: JSON.stringify(req.cookie)
  })
}

export default logger => config => fs => router => {
  router
    .get('/', index)
    .get('/person', person(logger)(config)(fs))
}
