import delegate from 'delegate'
import HelpDialog from '../../component/HelpDialog'
import TipsDialog from '../../component/TipsDialog'
import getNewId from './getNewId'

const helpDialog = new HelpDialog()
const tipsDialog = new TipsDialog()

export default class EditorContainer {
  constructor() {
    this._editors = []
    this._selected = null

    delegate(window, '.textae-editor', 'keyup', (event) => {
      // Keyup events occurs without selected editor, When editor is focused before initializing.
      if (this.selected) {
        switch (event.key) {
          case 'h':
            helpDialog.open()
            break
          case 'c':
          case 'x':
          case 'v':
            if (!event.ctrlKey && !event.metaKey) {
              tipsDialog.open()
            }
        }
      }
    })

    // Since the Body element does not yet exist at the time of initializing the EditorContainer,
    // we will set up an event handler in the document.
    document.addEventListener('copy', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.selected.instanceMethods.copyEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('cut', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.selected.instanceMethods.cutEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('paste', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.selected.instanceMethods.pasteEntitiesFromSystemClipboard(e)
      }
    })
  }

  push(editor) {
    Object.assign(editor, {
      editorId: getNewId(this._editors)
    })
    this._editors.push(editor)
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
}

function isTextFields(htmlElement) {
  return (
    htmlElement instanceof HTMLInputElement ||
    htmlElement instanceof HTMLTextAreaElement
  )
}
