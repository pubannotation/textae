// Maintainance a state of which the save button is able to be push.
import Observable from "observ"
import updateWritable from './updateWritable'

export default function(history, dataAccessObject, annotationData, buttonController) {
  let isDataModified = false
  const o = new Observable(false)

  function forceModified(val) {
    o.set(val)
    isDataModified = val
  }

  Object.assign(o, {forceModified})

  function updateWithModify(multitrack, reject) {
    updateWritable(o, multitrack, reject)
  }

  function update(val) {
    o.set(isDataModified || val)
  }

  function bind(history, dataAccessObject, annotationData, buttonController) {
    history.on('change', (state) => update(state.hasAnythingToSaveAnnotation))
    dataAccessObject.on('save', () => forceModified(false))
    annotationData.on('all.change', (_, multitrack, reject) => updateWithModify(multitrack, reject))
    o(val => buttonController.buttonStateHelper.transit('write', val))
  }

  bind(history, dataAccessObject, annotationData, buttonController)
}
