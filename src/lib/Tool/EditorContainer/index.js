import HelpDialog from '../../component/HelpDialog'
import getNewId from './getNewId'
import keyInputHandler from './keyInputHandler'

const helpDialog = new HelpDialog()

export default class EditorContainer {
  constructor() {
    this._editors = []
    this._selected = null
  }

  push(editor) {
    Object.assign(editor, {
      editorId: getNewId(this._editors)
    })
    this._editors.push(editor)

    editor[0].addEventListener('keyup', (e) => keyInputHandler(this, e))
  }

  get selected() {
    return this._selected
  }

  set selected(editor) {
    for (const editor of this._editors) {
      // Do not deselect the selected editor.
      // Otherwise, it will be deselected once when you reselect the currently selected editor and close the palette.
      if (editor !== editor) {
        editor.instanceMethods.deactive()
      }
    }
    editor.instanceMethods.active()

    this._selected = editor
  }

  unselect(editor) {
    if (this._selected === editor) {
      editor.instanceMethods.deactive()
      this._selected = null
    }
  }

  redraw() {
    this._editors.forEach((e) => e.instanceMethods.redraw())
  }

  findByHTMLelement(dom) {
    return this._editors.filter((e) => e[0] === dom)[0]
  }

  openHelpDialog() {
    helpDialog.open()
  }
}
