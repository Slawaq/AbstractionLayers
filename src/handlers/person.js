'use strict'

export default logger => config => fs => async (req, res) => {
  let person = await fs.get(config.state.person)
  res.end(person.toString())
}
