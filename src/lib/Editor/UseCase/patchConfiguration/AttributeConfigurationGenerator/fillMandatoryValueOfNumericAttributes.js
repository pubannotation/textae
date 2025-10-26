import { DEFAULT, STEP } from '../../../../NumericAttributeDefinition'
import clone from '../clone'

export default function (config) {
  config = clone(config)

  for (const a of config.filter((a) => a['value type'] === 'numeric')) {
    if (!Object.hasOwn(a, 'default')) {
      a.default = DEFAULT
    }
    if (!Object.hasOwn(a, 'step')) {
      a.step = STEP
    }
  }

  return config
}
