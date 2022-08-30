export default class FeatuerToggles {
  constructor(eventEmitter) {
    this._eventEmitter = eventEmitter
  }

  set availability(values) {
    const toggles = this._newToggles()

    for (const [key, value] of Object.entries(values)) {
      toggles.set(key, value)
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
