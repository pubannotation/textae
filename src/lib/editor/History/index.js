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

  reset(kind) {
    for (let i = 0; i < this.histories.length; i++) {
      if (
        this.histories[i].kind.indexOf(kind) !== -1 &&
        this.histories[i].kind.length === 1
      ) {
        this.histories.splice(i, 1)
        this.pointer--
      }
    }

    this.lastSaveIndexes[kind] = -1
    this.lastEditIndexes[kind] = -1
    this.trigger()
  }

  push(commands, kinds) {
    const historyMap = { kind: kinds, commands }

    this.histories.splice(
      this.pointer + 1,
      this.histories.length - this.pointer,
      historyMap
    )
    this.pointer++
    kinds.forEach((kind) => {
      this.lastEditIndexes[kind] = this.pointer
    })
    this.trigger()
  }

  next() {
    this.pointer++
    const nextEdit = this.histories[this.pointer]

    nextEdit.kind.forEach((kind) => {
      this.lastEditIndexes[kind] = this.pointer
    })
    this.trigger()
    return nextEdit.commands
  }

  prev() {
    const lastEdit = this.histories[this.pointer]

    this.pointer--

    lastEdit.kind.forEach((kind) => {
      if (this.pointer === -1) {
        this.lastEditIndexes[kind] = -1
      } else {
        const beforeGoBack = this.lastEditIndexes[kind]
        // Go back index one by one, because we don't know the prev history has same kind as the last edit history.
        for (let i = this.pointer; i >= 0; i--) {
          if (this.histories[i].kind.indexOf(kind) !== -1) {
            this.lastEditIndexes[kind] = i
            break
          }
        }

        // if all of the prev histories hasn't same kind, it means 'lastEdit' is the only one of the type.
        if (this.lastEditIndexes[kind] === beforeGoBack) {
          this.lastEditIndexes[kind] = -1
        }
      }
    })
    this.trigger()
    return lastEdit.commands
  }

  saved(kind) {
    this.lastSaveIndexes[kind] = this.lastEditIndexes[kind]
    this.trigger()
  }

  hasAnythingToSave(kind) {
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
      hasAnythingToSaveAnnotation: this.hasAnythingToSave(KINDS.anno),
      hasAnythingToSaveConfiguration: this.hasAnythingToSave(KINDS.conf),
      hasAnythingToUndo: this.hasAnythingToUndo(),
      hasAnythingToRedo: this.hasAnythingToRedo()
    })
  }
}
