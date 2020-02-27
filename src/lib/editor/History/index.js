import Pointer from './Pointer'
import Commands from './Commands'

// histories of edit to undo and redo.
export default class {
  constructor(eventEmitter) {
    this._resetHistory()
    this._eventEmitter = eventEmitter
  }

  push(commands) {
    const newCommands = new Commands(commands)

    // Delete the following history.
    this._histories.splice(
      this._pointer + 1,
      this._histories.length - this._pointer,
      newCommands
    )
    this._pointer++

    if (newCommands.kinds.has('annotation_command')) {
      this._pointerForAnnotation.lastEdit = this._pointer
    }
    if (newCommands.kinds.has('configuration_command')) {
      this._pointerForConfiguration.lastEdit = this._pointer
    }

    this._trigger()
  }

  next() {
    this._pointer++
    const next = this._histories[this._pointer]

    if (next.kinds.has('annotation_command')) {
      this._pointerForAnnotation.lastEdit = this._pointer
    }
    if (next.kinds.has('configuration_command')) {
      this._pointerForConfiguration.lastEdit = this._pointer
    }

    this._trigger()
    return next
  }

  prev() {
    const prev = this._histories[this._pointer]

    if (prev.kinds.has('annotation_command')) {
      this._pointerForAnnotation.lastEdit = this._getPrevPrevCommandIndexOf(
        'annotation_command'
      )
    }
    if (prev.kinds.has('configuration_command')) {
      this._pointerForConfiguration.lastEdit = this._getPrevPrevCommandIndexOf(
        'configuration_command'
      )
    }

    this._pointer--

    this._trigger()
    return prev
  }

  resetConfiguration() {
    this._removeConfigurationOperationsFromHistory()
    this._pointerForConfiguration.reset()
    this._trigger()
  }

  resetAllHistories() {
    this._resetHistory()
    this._trigger()
  }

  annotatioSaved() {
    this._pointerForAnnotation.save()
    this._trigger()
  }

  configurationSaved() {
    this._pointerForConfiguration.save()
    this._trigger()
  }

  get hasAnythingToSaveAnnotation() {
    return this._pointerForAnnotation.hasAnythingToSave
  }

  get hasAnythingToSaveConfiguration() {
    return this._pointerForConfiguration.hasAnythingToSave
  }

  get hasAnythingToUndo() {
    return this._pointer > -1
  }

  get hasAnythingToRedo() {
    return this._pointer < this._histories.length - 1
  }

  _getPrevPrevCommandIndexOf(kind) {
    const prevIndex = this._getPrevKindCommand(kind)
    // may be zero
    if (prevIndex !== undefined) {
      return prevIndex
    } else {
      return -1
    }
  }

  _getPrevKindCommand(kind) {
    for (let i = this._pointer - 1; i >= 0; i--) {
      if (this._histories[i].kinds.has(kind)) {
        return i
      }
    }
  }

  _trigger() {
    this._eventEmitter.emit('textae.history.change', this)
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
    this._pointerForAnnotation = new Pointer()
    this._pointerForConfiguration = new Pointer()
  }
}
