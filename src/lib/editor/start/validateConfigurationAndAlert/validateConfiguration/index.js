import Ajv from 'ajv'
import configurationScheme from './configurationScheme.json'

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

function toErrorMessage(errors) {
  for (const e of errors) {
    if (e.keyword === 'required') {
      return `Invalid configuration: The attribute type whose predicate is '${e.data.pred}' misses a mandatory property, '${e.params.missingProperty}'.`
    }
  }
}
