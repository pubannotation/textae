import {
  EventEmitter as EventEmitter
}
from 'events'
import KINDS from '../start/Command/Factory/kinds'

// histories of edit to undo and redo.
export default function() {
  const lastSaveIndexes = initIndexes()
  const lastEditIndexes = initIndexes()
  let pointer = -1
  const histories = []
  const hasAnythingToUndo = () => pointer > -1
  const hasAnythingToRedo = () => pointer < histories.length - 1
  const hasAnythingToSave = (kind) => lastEditIndexes[kind] !== lastSaveIndexes[kind]
  const emitter = new EventEmitter()

  return Object.assign(emitter, {
    reset: (kind) => {
      const adjustOtherKindIndexesFunc = (kind) => {
        lastSaveIndexes[kind]--
        lastEditIndexes[kind]--
      }

      for (let i = 0; i < histories.length; i++) {
        if (histories[i].kind.indexOf(kind) !== -1 && histories[i].kind.length === 1) {
          histories.splice(i, 1)
          Object.keys(KINDS).forEach(adjustOtherKindIndexesFunc)
          pointer--
        }
      }

      lastSaveIndexes[kind] = -1
      lastEditIndexes[kind] = -1
      trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo)
    },
    push: (commands, kinds) => {
      const historyMap = {kind: kinds, commands: commands}

      histories.splice(pointer + 1, histories.length - pointer, historyMap)
      pointer++
      kinds.forEach((kind) => {
        lastEditIndexes[kind] = pointer
      })
      trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo)
    },
    next: () => {
      pointer++
      const nextEdit = histories[pointer]

      nextEdit.kind.forEach((kind) => {
        lastEditIndexes[kind] = pointer
      })
      trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo)

      return nextEdit.commands
    },
    prev: () => {
      const lastEdit = histories[pointer]

      pointer--

      lastEdit.kind.forEach((kind) => {
        if (pointer === -1) {
          lastEditIndexes[kind] = -1
        } else {
          const beforeGoBack = lastEditIndexes[kind]
          // Go back index one by one, because we don't know the prev history has same kind as the last edit history.
          for (let i = pointer; i >= 0; i--) {
            if (histories[i].kind.indexOf(kind) !== -1) {
              lastEditIndexes[kind] = i
              break
            }
          }

          // if all of the prev histories hasn't same kind, it means 'lastEdit' is the only one of the type.
          if (lastEditIndexes[kind] === beforeGoBack) {
            lastEditIndexes[kind] = -1
          }
        }
      })
      trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo)

      return lastEdit.commands
    },
    saved: (kind) => {
      lastSaveIndexes[kind] = lastEditIndexes[kind]
      trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo)
    },
    hasAnythingToSave: hasAnythingToSave,
    hasAnythingToUndo: hasAnythingToUndo,
    hasAnythingToRedo: hasAnythingToRedo
  })
}

function initIndexes() {
  const map = {}
  Object.keys(KINDS).forEach((kind) => {
    map[KINDS[kind]] = -1
  })
  return map
}

function trigger(emitter, hasAnythingToSave, hasAnythingToUndo, hasAnythingToRedo) {
  emitter.emit('change', {
    hasAnythingToSaveAnnotation: hasAnythingToSave(KINDS.anno),
    hasAnythingToSaveConfiguration: hasAnythingToSave(KINDS.conf),
    hasAnythingToUndo: hasAnythingToUndo(),
    hasAnythingToRedo: hasAnythingToRedo()
  })
}
