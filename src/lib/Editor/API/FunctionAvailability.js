import alertifyjs from 'alertifyjs'

// This is a map of function names specified in config and those used internally.
const NAME_MAP = new Map([
  ['read', 'import'],
  ['write', 'upload'],
  ['write-auto', 'upload automatically'],
  ['view', 'view mode'],
  ['term', 'term edit mode'],
  ['block', 'block edit mode'],
  ['relation', 'relation edit mode'],
  ['simple', 'simple view'],
  ['line-height', 'adjust lineheight'],
  ['line-height-auto', 'auto adjust lineheight'],
  ['undo', 'undo'],
  ['redo', 'redo'],
  ['replicate', 'replicate span annotation'],
  ['replicate-auto', 'auto replicate'],
  ['boundary-detection', 'boundary detection'],
  ['create-span-by-touch', 'create span by touch'],
  ['expand-span-by-touch', 'expand span by touch'],
  ['shrink-span-by-touch', 'shrink span by touch'],
  ['entity', 'new entity'],
  ['pallet', 'pallet'],
  ['edit-properties', 'edit properties'],
  ['delete', 'delete'],
  ['copy', 'copy'],
  ['cut', 'cut'],
  ['paste', 'paste'],
  ['setting', 'setting'],
  ['help', 'help']
])

export default class FunctionAvailability {
  constructor() {
    // This is a map whose key is the function name
    // and its value is boolean value that is true if enabled.
    this._availabilities = this._default
  }

  get(type) {
    return this._availabilities.get(type)
  }

  set availability(values) {
    const availabilities = this._default

    if (values) {
      for (const [key, value] of Object.entries(values)) {
        availabilities.set(this._translate(key), value)
      }
    }

    this._availabilities = availabilities
  }

  get _default() {
    const map = new Map()

    // All functions are enabled by default.
    for (const key of NAME_MAP.values()) {
      map.set(key, true)
    }

    return map
  }

  _translate(keyName) {
    if (NAME_MAP.has(keyName)) {
      return NAME_MAP.get(keyName)
    }

    alertifyjs.warning(
      `'${keyName}' is an unknown function name for function availabilities.`
    )

    return keyName
  }
}
