'use strict'

import fs from 'fs'

export default class FileSystem {

  constructor () {
    this.cache = { }
  }

  get (name) {
    return this
      .getCached(name)
      .catch(_ => this.getForce(name))
      .then(data => this.cache[name] = data)
  }

  getJSON (name) {
    return this
      .get(name)
      .then(::JSON.parse)
  }

  getForce (name) {
    return new Promise(
      (resolve, reject) => fs.readFile(name, (err, data) =>
        err
        ? reject(err)
        : resolve(data)))
  }

  getCached(name) {
    return this.cache.hasOwnProperty(name)
      ? Promise.resolve(this.cache[name])
      : Promise.reject()
  }

  lazyUpdate (name, data) {
    let cacheUpdater = _ => this.cache[name] = data

    return this
      .getCached(name)
      .then(cacheUpdater, cacheUpdater)
      .then(_ => this.update(name, data))
  }

  update (name, data) {
    return new Promise(
      (resolve, reject) => fs.writeFile(name, data, err =>
        err
        ? reject(err)
        : resolve()))
  }

  clear (name) {
    return this
      .getCached(name)
      .then(_ => delete this.cache[name])
  }

}
