export default class FunctionAvailability {
  constructor(eventEmitter) {
    this._availabilities = this._newAvailabilities()
    this._eventEmitter = eventEmitter
  }

  get(type) {
    return this._availabilities.get(type)
  }

  set availability(values) {
    const toggles = this._newAvailabilities()

    if (values) {
      for (const [key, value] of Object.entries(values)) {
        toggles.set(key, value)
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
      ['relation', true],
      ['simple', true],
      ['line-height', true],
      ['line-height-auto', true],
      ['undo', true],
      ['redo', true],
      ['replicate', true],
      ['replicate-auto', true],
      ['boundary-detection', true],
      ['create-span-by-touch', true],
      ['expand-span-by-touch', true],
      ['shrink-span-by-touch', true],
      ['create-entity', true],
      ['pallet', true],
      ['edit-properties', true],
      ['delete', true],
      ['copy', true],
      ['cut', true],
      ['paste', true],
      ['setting', true],
      ['help', true]
    ])
  }
}
