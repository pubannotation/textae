import Ajv from 'ajv'
import configurationScheme from './configurationScheme.json'

const ajv = new Ajv()
const validate = ajv.compile(configurationScheme)

export default function(config) {
  if (!config) {
    return false
  }

  const valid = validate(config)
  if (!valid) {
    console.warn(validate.errors)
    return false
  }

  return true
}
