import Ajv from 'ajv'
import configurationScheme from './configurationScheme.json'
import toErrorMessage from './toErrorMessage'

const ajv = new Ajv({ verbose: true })
const validate = ajv.compile(configurationScheme)

export default function (config) {
  console.assert(config, 'config is required.')

  if (!validate(config)) {
    console.warn(validate.errors)

    return toErrorMessage(validate.errors)
  }

  return null
}
