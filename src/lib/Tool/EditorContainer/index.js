import HelpDialog from '../../component/HelpDialog'
import getNewId from './getNewId'
import keyInputHandler from './keyInputHandler'

const helpDialog = new HelpDialog()

export default class EditorContainer {
  constructor() {
    this._editorList = []
    this._selected = null
  }

  push(editor) {
    Object.assign(editor, {
      editorId: getNewId(this._editorList)
    })
    this._editorList.push(editor)

    editor[0].addEventListener('keyup', (e) => keyInputHandler(this, e))
  }

  get selected() {
    return this._selected
  }

  set selected(editor) {
    for (const editor of this._editorList) {
      // Do not deselect the selected editor.
      // Otherwise, it will be deselected once when you reselect the currently selected editor and close the palette.
      if (editor !== editor) {
        editor.api.unselect()
      }
    }
    editor.api.select()

    this._selected = editor
  }

  unselect(editor) {
    if (this._selected === editor) {
      editor.api.unselect()
      this._selected = null
    }
  }

  redraw() {
    this._editorList.forEach((e) => e.api.redraw())
  }

  findByHTMLelement(dom) {
    return this._editorList.filter((e) => e[0] === dom)[0]
  }

  openHelpDialog() {
    helpDialog.open()
  }
}
