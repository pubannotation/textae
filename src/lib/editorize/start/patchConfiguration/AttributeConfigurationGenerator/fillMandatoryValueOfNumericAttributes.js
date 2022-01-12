import clone from '../clone'
import {
  DEFAULT,
  STEP
} from '../../../AttributeDefinitionContainer/createAttributeDefinition/NumericAttributeDefinition'

export default function (config) {
  config = clone(config)

  for (const a of config.filter((a) => a['value type'] === 'numeric')) {
    if (!Object.prototype.hasOwnProperty.call(a, 'default')) {
      a.default = DEFAULT
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'step')) {
      a.step = STEP
    }
  }

  return config
}
