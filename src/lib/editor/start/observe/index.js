import CONFIRM_DISCARD_CHANGE_MESSAGE from '../../CONFIRM_DISCARD_CHANGE_MESSAGE'
import observeMouse from './observeMouse'
import observeHistoryChange from './observeHistoryChange'
import observeKey from './observeKey'
import observeTypeDefilinition from './observeTypeDefilinition'
import observeDataAccessObject from './observeDataAccessObject'

export default function(
  editor,
  history,
  annotationData,
  spanConfig,
  typeDefinition,
  params,
  statusBar,
  originalData,
  dataAccessObject
) {
  observeTypeDefilinition(editor, history)
  observeHistoryChange(editor, CONFIRM_DISCARD_CHANGE_MESSAGE)
  observeDataAccessObject(
    editor,
    spanConfig,
    typeDefinition,
    annotationData,
    params,
    statusBar,
    originalData,
    dataAccessObject
  )
  observeMouse(editor)
  observeKey(editor)
}
