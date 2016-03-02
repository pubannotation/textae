const ACTIVE_CLASS = 'textae-editor--active'

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
  unselect() {
    removeAciteveClass(this.editorList)
    this.selectedEditor = null
  }
  redraw() {
    this.editorList.forEach((editor) => window.requestAnimationFrame(editor.api.redraw))
  }
  observeKeyInput(onKeyup) {
    this.editorList.forEach((editor) => {
      editor[0].addEventListener('keyup', (event) => {
        onKeyup(event)
      })
    })
  }
}

function getNewId(editorList) {
  return 'editor' + editorList.length
}

function removeAciteveClass(editors) {
  // Remove ACTIVE_CLASS from all editor.
  editors
    .map(other => other[0])
    .forEach(elemet => {
      elemet.classList.remove(ACTIVE_CLASS)
    })
}

function switchActiveClass(editors, selected) {
  removeAciteveClass(editors)

  // Add ACTIVE_CLASS to the selected.
  selected[0].classList.add(ACTIVE_CLASS)
}
