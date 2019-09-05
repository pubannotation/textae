import delegate from 'delegate'
import create from './create'
import bind from './bind'
import update from './update'
import appendToDialog from './appendToDialog'

export default class {
  constructor(editor, typeDefinition, displayInstance) {
    const content = create()

    bind(content, editor, displayInstance, typeDefinition)

    const okHandler = () => {
      $dialog.close()
    }

    const $dialog = appendToDialog(content, okHandler)

    // Observe enter key press
    delegate($dialog[0], `.textae-editor--dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        okHandler()
      }
    })

    this._$dialog = $dialog
    this._editorDom = editor[0]
    this._typeDefinition = typeDefinition
    this._displayInstance = displayInstance
  }

  open() {
    update(
      this._$dialog[0],
      this._editorDom,
      this._typeDefinition,
      this._displayInstance
    )
    this._$dialog.open()
  }
}
