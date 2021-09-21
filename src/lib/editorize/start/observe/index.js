import debounce from 'debounce'
import isTouchDevice from '../../isTouchDevice'
import observeMouse from './observeMouse'
import observeKey from './observeKey'
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
  editor.eventEmitter.on('textae-event.type-definition.reset', () =>
    history.resetConfiguration()
  )

  editor.eventEmitter.on('textae-event.history.change', (history) => {
    // change leaveMessage show
    // Reloading when trying to scroll further when you are at the top on an Android device.
    // Show a confirmation dialog to prevent this.
    window.onbeforeunload =
      isTouchDevice() || history.hasAnythingToSaveAnnotation ? () => true : null
  })

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
