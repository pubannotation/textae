import showVilidationDialog from '../component/showVilidationDialog'
import KINDS from './start/Command/Factory/kinds'
import toastr from 'toastr'

export function observeModelChange(annotationData, history) {
  annotationData
    .on('all.change', (_, __, reject) => {
      resetAllHistories(history, KINDS)
      showVilidationDialog(self, reject)
    })
    .on('config.change', () => {
      history.reset(KINDS.conf)
    })
}

export function observeHistoryChange(history, buttonStateHelper, leaveMessage) {
  history.on('change', (state) => {
    // change button state
    buttonStateHelper.enabled("undo", state.hasAnythingToUndo)
    buttonStateHelper.enabled("redo", state.hasAnythingToRedo)

    // change leaveMessage show
    window.onbeforeunload = state.hasAnythingToSaveAnnotation ? () => leaveMessage : null
  })
}

export function observeDataSave(_, dataAccessObject, history) {
  dataAccessObject
    .on('save', () => {
      resetAllHistories(history, KINDS)
      toastr.success("annotation saved")
    })
    .on('save--config', () => {
      history.saved(KINDS.conf)
      toastr.success("configuration saved")
    })
    .on('save error', () => {
      toastr.error("could not save")
    })
}

function resetAllHistories(history, kinds) {
  Object.keys(kinds).forEach((kind) => {
    history.reset(kinds[kind])
  })
}
