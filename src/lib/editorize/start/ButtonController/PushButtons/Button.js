export default class Button {
  constructor(name, eventEmitter = null) {
    this._name = name
    this._eventEmitter = eventEmitter
    this._isPushed = false
  }

  get name() {
    return this._name
  }

  get isPushed() {
    return this._isPushed
  }

  set isPushed(value) {
    this._isPushed = value
    this._propagate()
  }

  toggle() {
    this._isPushed = !this._isPushed
    this._propagate()
  }

  _propagate() {
    if (this._eventEmitter) {
      this._eventEmitter.emit('textae-event.control.button.push', this)
    }
  }
}
