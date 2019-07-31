import { EventEmitter } from 'events'
import KINDS from '../start/Command/Factory/kinds'
import initIndexes from './initIndexes'

// histories of edit to undo and redo.
export default class extends EventEmitter {
  constructor() {
    super()
    this.lastSaveIndexes = initIndexes()
    this.lastEditIndexes = initIndexes()
    this.pointer = -1
    this.histories = []
  }

  _removeConfigurationOperationsFromHistory() {
    for (let i = 0; i < this.histories.length; i++) {
      if (this.histories[i].isExactly(KINDS.conf)) {
        this.pointer--
        this.histories.splice(i, 1)
      }
    }
  }

  _resetHistory() {
    this.pointer = -1
    this.histories = []
  }

  resetConfiguration() {
    this._removeConfigurationOperationsFromHistory()
    this.lastSaveIndexes[KINDS.conf] = -1
    this.lastEditIndexes[KINDS.conf] = -1
    this.trigger()
  }

  resetAllHistories() {
    this._resetHistory()
    this.lastSaveIndexes[KINDS.anno] = -1
    this.lastEditIndexes[KINDS.anno] = -1
    this.lastSaveIndexes[KINDS.conf] = -1
    this.lastEditIndexes[KINDS.conf] = -1
    this.trigger()
  }

  push(commands) {
    this.histories.splice(
      this.pointer + 1,
      this.histories.length - this.pointer,
      commands
    )
    this.pointer++
    for (const kind of commands.kinds.values()) {
      this.lastEditIndexes[kind] = this.pointer
    }
    this.trigger()
  }

  next() {
    this.pointer++
    const nextEdit = this.histories[this.pointer]

    for (const kind of nextEdit.kinds.values()) {
      this.lastEditIndexes[kind] = this.pointer
    }

    this.trigger()
    return nextEdit
  }

  prev() {
    const lastEdit = this.histories[this.pointer]

    this.pointer--

    for (const kind of lastEdit.kinds.values()) {
      if (this.pointer === -1) {
        this.lastEditIndexes[kind] = -1
      } else {
        const beforeGoBack = this.lastEditIndexes[kind]
        // Go back index one by one, because we don't know the prev history has same kind as the last edit history.
        for (let i = this.pointer; i >= 0; i--) {
          if (this.histories[i].kinds.has(kind)) {
            this.lastEditIndexes[kind] = i
            break
          }
        }

        // if all of the prev histories hasn't same kind, it means 'lastEdit' is the only one of the type.
        if (this.lastEditIndexes[kind] === beforeGoBack) {
          this.lastEditIndexes[kind] = -1
        }
      }
    }

    this.trigger()
    return lastEdit
  }

  configurationSaved() {
    const kind = KINDS.conf
    this.lastSaveIndexes[kind] = this.lastEditIndexes[kind]
    this.trigger()
  }

  hasAnythingToSaveAnnotation() {
    const kind = KINDS.anno
    return this.lastEditIndexes[kind] !== this.lastSaveIndexes[kind]
  }

  hasAnythingToSaveConfiguration() {
    const kind = KINDS.conf
    return this.lastEditIndexes[kind] !== this.lastSaveIndexes[kind]
  }

  hasAnythingToUndo() {
    return this.pointer > -1
  }

  hasAnythingToRedo() {
    return this.pointer < this.histories.length - 1
  }

  trigger() {
    super.emit('change', {
      hasAnythingToSaveAnnotation: this.hasAnythingToSaveAnnotation(),
      hasAnythingToSaveConfiguration: this.hasAnythingToSaveConfiguration(),
      hasAnythingToUndo: this.hasAnythingToUndo(),
      hasAnythingToRedo: this.hasAnythingToRedo()
    })
  }
}
