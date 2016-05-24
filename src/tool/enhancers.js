'use strict'

export let jsonResponse = response => data => {
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(data))
}

export let humanityJson = response => data => {
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(data, null, 2))
}

export let content = request => _ => {
  let body = []
  return new Promise((resolve, reject) => request
    .on('data', ::body.push)
    .on('end', _ => resolve(Buffer.concat(body)))
    .on('error', e => reject(e))
  )
}

export let jsonContent = request => async _ => {
  let data = await content(request)()

  if (request.headers['Content-Type'] === 'application/json') {
    return JSON.parse(data)
  }

  return data
    .toString()
    .split('&')
    .map(x => x.split('=').map(y => decodeURIComponent(y.replace(/\+/g, '%20'))))
    .map(x => ({ key: x[0], value: x[1] }))
    .reduce((r, x) => ({ ...r, [x.key]: x.value }), { })
}
