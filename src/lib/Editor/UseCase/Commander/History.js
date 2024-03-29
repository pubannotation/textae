// histories of edit to undo and redo.
export default class History {
  constructor(eventEmitter) {
    this._resetHistory()
    this._eventEmitter = eventEmitter

    eventEmitter
      .on('textae-event.type-definition.reset', () => {
        this._removeConfigurationOperationsFromHistory()
        this._trigger()
      })
      .on('textae-event.annotation-data.all.change', () => {
        this._resetHistory()
        this._trigger()
      })
      .on('textae-event.resource.annotation.save', () => {
        this._trigger()
      })
      .on('textae-event.resource.configuration.save', () => {
        this._trigger()
      })
  }

  push(command) {
    // Delete the following history.
    this._histories.splice(
      this._pointer + 1,
      this._histories.length - this._pointer,
      command
    )
    this._pointer++
    this._trigger()
  }

  next() {
    this._pointer++
    const next = this._histories[this._pointer]
    this._trigger()
    return next
  }

  prev() {
    const prev = this._histories[this._pointer]
    this._pointer--
    this._trigger()
    return prev
  }

  get hasAnythingToUndo() {
    return this._pointer > -1
  }

  get hasAnythingToRedo() {
    return this._pointer < this._histories.length - 1
  }

  _trigger() {
    this._eventEmitter.emit('textae-event.history.change', this)
  }

  _removeConfigurationOperationsFromHistory() {
    for (let i = 0; i < this._histories.length; i++) {
      if (this._histories[i].isExactly('configuration_command')) {
        this._pointer--
        this._histories.splice(i, 1)
      }
    }
  }

  _resetHistory() {
    this._pointer = -1
    this._histories = []
  }
}
