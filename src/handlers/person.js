'use strict'

export default logger => config => fs => async (req, res) => {
  let person = await fs.getJSON(config.state.person)

  let age = Math.floor((new Date() - new Date(person.birth)) / 31536000000)

  res.humanityJson({ ...person, age })
}
