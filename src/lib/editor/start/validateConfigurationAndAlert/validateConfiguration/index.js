import Ajv from 'ajv'
import configurationScheme from './configurationScheme.json'
import toErrorMessage from './toErrorMessage'

const ajv = new Ajv({ verbose: true })
const validate = ajv.compile(configurationScheme)

export default function(config) {
  if (!config) {
    return [false]
  }

  const valid = validate(config)
  if (!valid) {
    console.warn(validate.errors)

    return [false, toErrorMessage(validate.errors)]
  }

  return [true]
}
