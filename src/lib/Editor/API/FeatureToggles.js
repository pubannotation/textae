export default class FeatuerToggles {
  constructor(eventEmitter) {
    this._toggles = this._newToggles()
    this._eventEmitter = eventEmitter
  }

  get(type) {
    return this._toggles.get(type)
  }

  set availability(values) {
    const toggles = this._newToggles()

    if (values) {
      for (const [key, value] of Object.entries(values)) {
        toggles.set(key, value)
      }
    }

    this._toggles = toggles
  }

  _newToggles() {
    return new Map([
      ['read', true],
      ['write', true],
      ['write-auto', true],
      ['view', true],
      ['term', true],
      ['block', true],
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
      ['entity', true],
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
