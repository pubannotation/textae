import debounce from 'debounce'
import delegate from 'delegate'
import HelpDialog from '../../component/HelpDialog'
import TipsDialog from '../../component/TipsDialog'

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

    // Enable/disable the context menu icon by looking at the text selection.
    document.addEventListener(
      'selectionchange',
      debounce(() => {
        if (this.selected) {
          this.selected.instanceMethods.applyTextSelection()
        }
      }, 100)
    )
    document.addEventListener('contextmenu', () => {
      if (this.selected) {
        this.selected.instanceMethods.applyTextSelection()
      }
    })
  }

  push(editor, element) {
    this._editors.push({ editor, element })
  }

  get selected() {
    return this._selected
  }

  set selected(editor) {
    editor.instanceMethods.active()

    this._selected = editor
  }

  unselect(editor) {
    if (this._selected === editor) {
      editor.instanceMethods.deactive()
      this._selected = null
    }
  }

  drawGridsInSight() {
    for (const { editor } of this._editors) {
      editor.instanceMethods.drawGridsInSight()
    }
  }

  relayout() {
    this._editors.forEach(({ editor }) => editor.instanceMethods.relayout())
  }

  findByHTMLelement(element) {
    return this._editors.find(({ editor }) => editor[0] === element).editor
  }

  get nextID() {
    return `editor${this._editors.length}`
  }
}

function isTextFields(htmlElement) {
  return (
    htmlElement instanceof HTMLInputElement ||
    htmlElement instanceof HTMLTextAreaElement
  )
}
