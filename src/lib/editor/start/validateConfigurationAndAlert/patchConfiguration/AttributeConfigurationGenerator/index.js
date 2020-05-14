import toDefinition from './toDefinition'
import merge from './merge'

export default class {
  constructor(annotations = [], config = []) {
    this._annotations = annotations
    this._config = config
  }

  get configuration() {
    return merge(this._config, this._generated)
  }

  get _generated() {
    return [...this._predicateMap.entries()].map(([pred, objects]) =>
      toDefinition(pred, objects)
    )
  }

  get _predicateMap() {
    return this._annotations.reduce((map, attr) => {
      if (map.has(attr.pred)) {
        map.get(attr.pred).push(attr.obj)
      } else {
        map.set(attr.pred, [attr.obj])
      }

      return map
    }, new Map())
  }
}
