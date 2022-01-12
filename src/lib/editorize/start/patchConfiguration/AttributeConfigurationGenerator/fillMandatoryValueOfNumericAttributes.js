import clone from '../clone'
import {
  DEFAULT,
  MAX,
  MIN,
  STEP
} from '../../../AttributeDefinitionContainer/createAttributeDefinition/NumericAttributeDefinition'

export default function (config) {
  config = clone(config)

  for (const a of config.filter((a) => a['value type'] === 'numeric')) {
    if (!Object.prototype.hasOwnProperty.call(a, 'default')) {
      a.default = DEFAULT
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'min')) {
      a.min = MIN
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'max')) {
      a.max = MAX
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'step')) {
      a.step = STEP
    }
  }

  return config
}
