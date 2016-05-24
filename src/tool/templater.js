'use strict'

const variablePattern = /@([^\d\W]\w+)/g

export default class Templater {

  constructor (logger, templates) {
    this.logger = logger
    this.templates = templates
  }

  render (name, params = { }) {
    let regexp = new RegExp(variablePattern)
    let template = this.templates[name]

    if (!template) {
      this.logger.error(`Cannot find template ${name}!`)
      return null
    }

    return this.replace(name, regexp, template, params)
  }

  replace (name, regexp, template, params) {
    let variables = regexp.exec(template)

    while (variables) {
      let replace = variables[0]
      let to = params[variables[1]]

      if (to) {
        template = template.replace(replace, to)
      } else {
        this.logger.error(`Cannot find ${name} template params ${variables[1]}!`, params)
      }

      variables = regexp.exec(template)
    }

    return template
  }

  enhanceHttpResponse (response) {
    return (...args) => {
      response.setHeader('Content-Type', 'text/html')
      response.end(this.render(...args))
    }
  }

  static load (logger, { templatePath, templates }, fs) {
    let loadingTemplates = Object
      .keys(templates)
      .map(key => fs
        .get(templatePath + templates[key])
        .then(x => ({ name: key, html: x.toString() })))

    return Promise
      .all(loadingTemplates)
      .then(loaded => loaded
      .reduce((r, x) => ({ ...r, [x.name]: x.html }), {}))
  }

}
