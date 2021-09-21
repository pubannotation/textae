import debounce from 'debounce'
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
    originalData,
    dataAccessObject,
    buttonController
  )
  observeMouse(editor)
  observeKey(editor)

  document.addEventListener(
    'selectionchange',
    debounce(() => editor.instanceMethods.applyTextSelection(), 100)
  )
  document.addEventListener('contextmenu', () =>
    editor.instanceMethods.applyTextSelection()
  )
}
