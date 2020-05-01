import toDefinition from './toDefinition'

export default class {
  constructor(attributes = []) {
    this._predicateMap = attributes.reduce((map, attr) => {
      if (map.has(attr.pred)) {
        map.get(attr.pred).push(attr.obj)
      } else {
        map.set(attr.pred, [attr.obj])
      }

      return map
    }, new Map())
  }

  get configuration() {
    return [...this._predicateMap.entries()].map(([pred, objects]) =>
      toDefinition(pred, objects)
    )
  }
}
