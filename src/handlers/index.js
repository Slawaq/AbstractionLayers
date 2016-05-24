'use strict'

import { get as getPerson, edit as editPerson, update as updatePerson } from './person'

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
    .get('/person/edit', editPerson(logger)(config)(fs))
    .get('/person', getPerson(logger)(config)(fs))
    .post('/person', updatePerson(logger)(config)(fs))
}
