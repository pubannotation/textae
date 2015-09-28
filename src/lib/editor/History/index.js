import {
  EventEmitter as EventEmitter
}
from 'events'

// histories of edit to undo and redo.
export default function() {
  let lastSaveIndex = -1,
    lastEditIndex = -1,
    history = [],
    hasAnythingToUndo = () => lastEditIndex > -1,
    hasAnythingToRedo = () => lastEditIndex < history.length - 1,
    hasAnythingToSave = () => lastEditIndex !== lastSaveIndex,
    emitter = new EventEmitter(),
    trigger = () => {
      emitter.emit('change', {
        hasAnythingToSave: hasAnythingToSave(),
        hasAnythingToUndo: hasAnythingToUndo(),
        hasAnythingToRedo: hasAnythingToRedo()
      })
    }

  return _.extend(emitter, {
    reset: () => {
      lastSaveIndex = -1
      lastEditIndex = -1
      history = []
      trigger()
    },
    push: (commands) => {
      history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands)
      lastEditIndex++
      trigger()
    },
    next: () => {
      lastEditIndex++
      trigger()
      return history[lastEditIndex]
    },
    prev: () => {
      var lastEdit = history[lastEditIndex]
      lastEditIndex--
      trigger()
      return lastEdit
    },
    saved: () => {
      lastSaveIndex = lastEditIndex
      trigger()
    },
    hasAnythingToSave: hasAnythingToSave,
    hasAnythingToUndo: hasAnythingToUndo,
    hasAnythingToRedo: hasAnythingToRedo
  })
}
