'use strict'

export let parse = request => {
  let { cookie } = request.headers

  return cookie
    ? cookie
      .split(';')
      .map(x => x.split('='))
      .map(x => ({ key: x[0].trim(), value: x[1].trim() || '' }))
      .reduce((r, x) => ({ ...r, [x.key]: x.value }), { })
    : { }
}

export let write = response => values => {
  let encoded = Object
    .keys(values)
    .map(key => `${key}=${values[key]}`)
    .join(';')
  response.setHeader('Set-Cookie', encoded)
}
