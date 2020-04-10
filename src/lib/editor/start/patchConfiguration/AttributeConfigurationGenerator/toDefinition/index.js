import getValueType from './getValueType'
import getStep from './getStep'
import getDefault from './getDefault'

export default function(pred, objects) {
  const prototype = {
    pred,
    'value type': getValueType(objects[0])
  }

  switch (prototype['value type']) {
    case 'flag':
      return prototype
    case 'numeric':
      return Object.assign(
        {
          min: Math.min(...objects),
          max: Math.max(...objects),
          step: getStep(objects),
          default: getDefault(objects)
        },
        prototype
      )
    case 'string':
      return Object.assign(
        {
          default: getDefault(objects)
        },
        prototype
      )
    default:
      throw new Error(`${prototype}`)
  }
}
