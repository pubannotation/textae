import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import configurationScheme from './configurationScheme.json'
import toErrorMessage from './toErrorMessage'

const ajv = new Ajv({ verbose: true })
addFormats(ajv, ['uri-reference', 'regex'])
const validate = ajv.compile(configurationScheme)

export default function (config) {
  console.assert(config, 'config is required.')

  if (!validate(config)) {
    console.warn(validate.errors)

    return toErrorMessage(validate.errors)
  }

  return null
}
