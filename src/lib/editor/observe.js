import showVilidationDialog from '../component/showVilidationDialog'
import toastr from 'toastr'

export function observeModelChange(annotationData, history, writable) {
  annotationData
    .on('all.change', (annotationData, multitrack, reject) => {
      history.reset()
      showVilidationDialog(self, reject)
    })
}

export function observeHistoryChange(history, buttonStateHelper, leaveMessage, writable) {
  history.on('change', function(state) {
    // change button state
    buttonStateHelper.enabled("undo", state.hasAnythingToUndo)
    buttonStateHelper.enabled("redo", state.hasAnythingToRedo)

    // change leaveMessage show
    window.onbeforeunload = state.hasAnythingToSave ? function() {
      return leaveMessage
    } : null

    writable.update(state.hasAnythingToSave)
  })
}

export function observeDataSave(dataAccessObject, history, writable) {
  dataAccessObject
    .on('save', function() {
      history.saved()
      writable.forceModified(false)
      toastr.success("annotation saved")
    })
    .on('save error', function() {
      toastr.error("could not save")
    })
}
