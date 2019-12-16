import HelpDialog from '../../component/HelpDialog'
import getNewId from './getNewId'
import switchActiveClass from './switchActiveClass'

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

  observeKeyInput(onKeyup) {
    this.editorList.forEach((e) =>
      e[0].addEventListener('keyup', (event) => {
        e.eventEmitter.emit('textae.key.input')
        onKeyup(event)
      })
    )
  }

  findByDom(dom) {
    return this.editorList.filter((e) => e[0] === dom)[0]
  }

  openHelpDialog() {
    helpDialog()
  }
}
