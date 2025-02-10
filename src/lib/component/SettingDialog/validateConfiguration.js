import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import configurationScheme from '../../configurationScheme.json'

const ajv = new Ajv({ verbose: true })
addFormats(ajv, ['uri-reference', 'regex'])
const validate = ajv.compile(configurationScheme)

export default function validateConfiguration(config) {
  if (!validate(config)) {
    console.warn(validate.errors)
  }
}
