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

  if (config['attribute types']) {
    const selectionAttributesWithIncorrectNumberOfDefaultValue = config[
      'attribute types'
    ]
      .filter((a) => a['value type'] === 'selection')
      .find((a) => a.values.filter((v) => v.default).length !== 1)

    if (selectionAttributesWithIncorrectNumberOfDefaultValue) {
      console.warn(
        `selection attribute must have just one default value: ${JSON.stringify(
          selectionAttributesWithIncorrectNumberOfDefaultValue
        )}`
      )
      return false
    }
  }

  return true
}
