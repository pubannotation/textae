import showVilidationDialog from '../component/showVilidationDialog'
import toastr from 'toastr'

export function observeModelChange(annotationData, history) {
  annotationData.on('all.change', (_, __, reject) => {
    history.resetAllHistories()
    showVilidationDialog(self, reject)
  })
}

export function observeHistoryChange(history, buttonStateHelper, leaveMessage) {
  history.on('change', () => {
    // change button state
    buttonStateHelper.enabled('undo', history.hasAnythingToUndo)
    buttonStateHelper.enabled('redo', history.hasAnythingToRedo)

    // change leaveMessage show
    window.onbeforeunload = history.hasAnythingToSaveAnnotation
      ? () => leaveMessage
      : null
  })
}

export function observeDataSave(_, dataAccessObject, history) {
  dataAccessObject
    .on('save', () => {
      history.resetAllHistories()
      toastr.success('annotation saved')
    })
    .on('save--config', () => {
      history.configurationSaved()
      toastr.success('configuration saved')
    })
    .on('save error', () => {
      toastr.error('could not save')
    })
}
