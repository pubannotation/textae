import HelpDialog from '../../component/HelpDialog'
import getNewId from './getNewId'
import switchActiveClass from './switchActiveClass'
import keyInputHandler from './keyInputHandler'

const helpDialog = new HelpDialog()

export default class {
  constructor() {
    this.editorList = []
    this.selectedEditor = null
  }

  push(editor) {
    Object.assign(editor, {
      editorId: getNewId(this.editorList)
    })
    this.editorList.push(editor)

    editor[0].addEventListener('keyup', (e) => keyInputHandler(this, e))
  }

  get selected() {
    return this.selectedEditor
  }

  set selected(editor) {
    switchActiveClass(this.editorList, editor)
    this.selectedEditor = editor
  }

  unselect(editor) {
    if (this.selectedEditor === editor) {
      editor.api.unselect()
      this.selectedEditor = null
    }
  }

  redraw() {
    this.editorList.forEach((e) => e.api.redraw())
  }

  findByDom(dom) {
    return this.editorList.filter((e) => e[0] === dom)[0]
  }

  openHelpDialog() {
    helpDialog.open()
  }
}
