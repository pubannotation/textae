import getValueType from './getValueType'
import getMostFrequentObject from './getMostFrequentObject'
import getStep from './getStep'

export default class AnnotationsForPred {
  constructor({ pred, obj }) {
    this._pred = pred
    this._objects = [obj]
  }

  push(obj) {
    this._objects.push(obj)
  }

  // It is not possible to generate a selection attribute definition.
  // Since it is not possible to determine whether the value type is a string or a selection from the annotation,
  // it is always treated as a string.
  get definition() {
    switch (getValueType(this._objects[0])) {
      case 'flag':
        return this._prototype
      case 'numeric':
        return this._numericAttribute
      case 'string':
        return this._stringAttribute

      default:
        throw new Error(`prototype: ${JSON.stringify(this._prototype)}`)
    }
  }

  get mostFrequentObject() {
    return getMostFrequentObject(this._objects)
  }

  get _prototype() {
    return {
      pred: this._pred,
      'value type': getValueType(this._objects[0])
    }
  }

  get _numericAttribute() {
    return {
      min: Math.min(...this._objects),
      max: Math.max(...this._objects),
      step: getStep(this._objects),
      default: getMostFrequentObject(this._objects),
      ...this._prototype
    }
  }

  get _stringAttribute() {
    return {
      default: getMostFrequentObject(this._objects),
      ...this._prototype
    }
  }
}
