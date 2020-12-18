import observeMouse from './observeMouse'
import observeHistoryChange from './observeHistoryChange'
import observeKey from './observeKey'
import observeTypeDefilinition from './observeTypeDefilinition'
import observeDataAccessObject from './observeDataAccessObject'

export default function (
  editor,
  history,
  annotationData,
  spanConfig,
  params,
  statusBar,
  originalData,
  dataAccessObject,
  buttonController
) {
  observeTypeDefilinition(editor, history)
  observeHistoryChange(editor)
  observeDataAccessObject(
    editor,
    spanConfig,
    annotationData,
    params,
    statusBar,
    originalData,
    dataAccessObject,
    buttonController
  )
  observeMouse(editor)
  observeKey(editor)
}
