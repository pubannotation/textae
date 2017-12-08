import {
  EventEmitter as EventEmitter
}
from 'events'
import _ from 'underscore'
import KINDS from '../start/Command/Factory/kinds'

// histories of edit to undo and redo.
export default function() {
  let
    lastSaveIndexes = initIndexes(),
    lastEditIndexes = initIndexes(),
    pointer = -1,
    histories = [],
    hasAnythingToUndo = () => pointer > -1,
    hasAnythingToRedo = () => pointer < histories.length - 1,
    hasAnythingToSave = (kind) => lastEditIndexes[kind] !== lastSaveIndexes[kind],
    emitter = new EventEmitter(),
    trigger = () => {
      emitter.emit('change', {
        hasAnythingToSaveAnnotation: hasAnythingToSave(KINDS.anno),
        hasAnythingToSaveConfiguration: hasAnythingToSave(KINDS.conf),
        hasAnythingToUndo: hasAnythingToUndo(),
        hasAnythingToRedo: hasAnythingToRedo()
      })
    }

  return _.extend(emitter, {
    reset: (kind) => {
      let historyLen = histories.length
      let adjustOtherKindIndexesFunc = (kind) => {
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
      trigger()
    },
    push: (commands, kinds) => {
      let historyMap = {kind: kinds, commands: commands}
      histories.splice(pointer + 1, histories.length - pointer, historyMap)
      pointer++
      kinds.forEach((kind) => {
        lastEditIndexes[kind] = pointer
      })
      trigger()
    },
    next: () => {
      pointer++
      let nextEdit = histories[pointer]
      nextEdit.kind.forEach((kind) => {
        lastEditIndexes[kind] = pointer
      })
      trigger()
      return nextEdit.commands
    },
    prev: () => {
      let lastEdit = histories[pointer]
      pointer--
      lastEdit.kind.forEach((kind) => {
        if (pointer === -1) {
          lastEditIndexes[kind] = -1
        } else {
          let beforeGoBack = lastEditIndexes[kind]
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
      trigger()
      return lastEdit.commands
    },
    saved: (kind) => {
      lastSaveIndexes[kind] = lastEditIndexes[kind]
      trigger()
    },
    hasAnythingToSave: hasAnythingToSave,
    hasAnythingToUndo: hasAnythingToUndo,
    hasAnythingToRedo: hasAnythingToRedo
  })
}

function initIndexes() {
  let map = {}
  Object.keys(KINDS).forEach((kind) => {
    map[KINDS[kind]] = -1
  })
  return map
}
