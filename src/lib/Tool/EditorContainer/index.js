import HelpDialog from '../../component/HelpDialog'
import getNewId from './getNewId'
import switchActiveClass from './switchActiveClass'
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
    switchActiveClass(this._editorList, editor)
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
