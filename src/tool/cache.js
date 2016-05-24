'use strict'

export default class Cache {

  constructor () {
    this.cache = { }
  }

  get (key) {
    return this
      .exist(key)
      .then(_ => this.cache[key])
  }

  update (key, data) {
    let cacheUpdater = _ => this.cache[key] = data

    return this
      .exist(key)
      .then(cacheUpdater, cacheUpdater)
  }

  exist (key) {
    return this.cache.hasOwnProperty(key)
      ? Promise.resolve(key)
      : Promise.reject()
  }

  clear (name) {
    return this
      .get(name)
      .then(_ => delete this.cache[name])
  }
}
