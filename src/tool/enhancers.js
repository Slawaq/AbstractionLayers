'use strict'

export let jsonResponse = response => data => {
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(data))
}

export let humanityJson = response => data => {
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(data, null, 2))
}
