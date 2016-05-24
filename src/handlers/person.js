'use strict'

export let get = logger => config => fs => async (req, res) => {
  let person = await fs.getJSON(config.state.person)

  let age = Math.floor((new Date() - new Date(person.birth)) / 31536000000)

  res.humanityJson({ ...person, age })
}

export let edit = logger => config => fs => async (req, res) => {
  let person = await fs.getJSON(config.state.person)

  res.template('edit', person)
}

export let update = logger => config => fs => async (req, res) => {
  let person = await req.jsonContent()
  let name = person.name.trim()

  await fs.updateJSON(config.state.person, { ...person, name })

  res.redirect('/person')
}
