export default class FunctionAvailability {
  constructor() {
    this._availabilities = this._newAvailabilities()
  }

  get(type) {
    return this._availabilities.get(type)
  }

  set availability(values) {
    const toggles = this._newAvailabilities()

    if (values) {
      for (const [key, value] of Object.entries(values)) {
        toggles.set(this._translate(key), value)
      }
    }

    this._availabilities = toggles
  }

  _newAvailabilities() {
    return new Map([
      ['import', true],
      ['upload', true],
      ['upload automatically', true],
      ['view mode', true],
      ['term edit mode', true],
      ['block edit mode', true],
      ['relation edit mode', true],
      ['simple view', true],
      ['adjust lineheight', true],
      ['auto adjust lineheight', true],
      ['undo', true],
      ['redo', true],
      ['replicate span annotation', true],
      ['auto replicate', true],
      ['boundary detection', true],
      ['create span by touch', true],
      ['expand span by touch', true],
      ['shrink span by touch', true],
      ['new entity', true],
      ['pallet', true],
      ['edit properties', true],
      ['delete', true],
      ['copy', true],
      ['cut', true],
      ['paste', true],
      ['setting', true],
      ['help', true]
    ])
  }

  _translate(keyName) {
    const map = new Map([
      ['read', 'import'],
      ['write', 'update'],
      ['write-auto', 'upload automatically'],
      ['view', 'view mode'],
      ['term', 'term edit mode'],
      ['block', 'block edit mode'],
      ['relation', 'relation edit mode'],
      ['simple', 'simple view'],
      ['line-height', 'adjust lineheight'],
      ['line-height-auto', 'auto adjust lineheight'],
      ['replicate', 'replicate span annotation'],
      ['replicate-auto', 'auto replicate'],
      ['boundary-detection', 'boundary detection'],
      ['create-span-by-touch', 'create span by touch'],
      ['expand-span-by-touch', 'expand span by touch'],
      ['shrink-span-by-touch', 'shrink span by touch'],
      ['entity', 'new entity'],
      ['edit-properties', 'edit properties']
    ])

    if (map.has(keyName)) {
      return map.get(keyName)
    }

    return keyName
  }
}
