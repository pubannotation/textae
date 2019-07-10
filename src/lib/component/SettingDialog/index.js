import delegate from 'delegate'
import create from './create'
import update from './update'
import appendToDialog from './appendToDialog'

export default function(editor, typeContainer, displayInstance) {
  const content = create(editor, displayInstance)
  const okHandler = () => {
    $dialog.close()
  }
  const $dialog = appendToDialog(
    content, editor, okHandler
  )

  // Observe enter key press
  delegate($dialog[0], `.textae-editor--dialog`, 'keyup', (e) => {
    if (e.keyCode === 13) {
      okHandler()
    }
  })

  return () => {
    update($dialog, editor, typeContainer, displayInstance)
    return $dialog.open()
  }
}


