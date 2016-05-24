'use strict'

import fs from 'fs'
import Cache from './cache'

export default class FileSystem extends Cache {

  get (name) {
    return super
      .get(name)
      .catch(_ => this.getForce(name))
      .then(data => super.update(name, data))
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

  update (name, data) {
    return super
      .update(name, data)
      .then(_ => this.updateOnDisk(name, data))
  }

  updateJSON (name, json) {
    let data = JSON.stringify(json, null, 2)
    return this.update(name, data)
  }

  updateOnDisk (name, data) {
    return new Promise(
      (resolve, reject) => fs.writeFile(name, data, err =>
        err
        ? reject(err)
        : resolve(data)))
  }

}
