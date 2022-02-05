import debounce from 'debounce'
import delegate from 'delegate'
import HelpDialog from '../../component/HelpDialog'
import TipsDialog from '../../component/TipsDialog'
import observeBodyEvents from './observeBodyEvents'

const helpDialog = new HelpDialog()
const tipsDialog = new TipsDialog()

export default class EditorContainer {
  constructor() {
    this._editors = new Map()
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

    this._observeDocumentEvents()
  }

  observeBodyEvents() {
    observeBodyEvents(this)
  }

  set(element, editor) {
    this._editors.set(element, editor)
  }

  get selected() {
    return this._selected
  }

  set selected(element) {
    this._editors.get(element).active()

    this._selected = element
  }

  unselect(element) {
    if (this._selected === element) {
      this._editors.get(element).deactive()
      this._selected = null
    }
  }

  drawGridsInSight() {
    for (const editor of this._editors.values()) {
      editor.drawGridsInSight()
    }
  }

  relayout() {
    for (const editor of this._editors.values()) {
      editor.relayout()
    }
  }

  has(element) {
    return this._editors.has(element)
  }

  get nextID() {
    return `editor${this._editors.size}`
  }

  _observeDocumentEvents() {
    // Since the Body element does not yet exist at the time of initializing the EditorContainer,
    // we will set up an event handler in the document.
    document.addEventListener('copy', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this._editors.get(this.selected).copyEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('cut', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this._editors.get(this.selected).cutEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('paste', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this._editors.get(this.selected).pasteEntitiesFromSystemClipboard(e)
      }
    })

    // Enable/disable the context menu icon by looking at the text selection.
    document.addEventListener(
      'selectionchange',
      debounce(() => {
        if (this.selected) {
          this._editors.get(this.selected).applyTextSelection()
        }
      }, 100)
    )
    document.addEventListener('contextmenu', () => {
      if (this.selected) {
        this._editors.get(this.selected).applyTextSelection()
      }
    })

    // Close ContextMenu when another editor is clicked
    document.addEventListener('click', (e) => {
      // In Firefox, the right button of mouse fires a 'click' event.
      // https://stackoverflow.com/questions/43144995/mouse-right-click-on-firefox-triggers-click-event
      // In Fireforx, MoesueEvent has a 'which' property, which is 3 when the right button is clicked.
      // https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
      if (e.which === 3) {
        return
      }

      for (const api of this._editors.values()) {
        api.hideContextMenu()
      }
    })

    document.addEventListener('contextmenu', (contextmenuEvent) => {
      // Close ContextMenu when another editor is clicked.
      for (const api of this._editors.values()) {
        api.hideContextMenu()
      }

      // If the editor you click on is selected and editable,
      // it will display its own context menu, rather than the browser's context menu.
      const clickedEditor = contextmenuEvent.target.closest('.textae-editor')
      if (clickedEditor === this._selected) {
        if (
          clickedEditor.classList.contains(
            'textae-editor__mode--view-with-relation'
          ) ||
          clickedEditor.classList.contains(
            'textae-editor__mode--view-without-relation'
          )
        ) {
          return
        }

        // Prevent show browser default context menu
        contextmenuEvent.preventDefault()
        this._editors.get(this._selected).showContextMenu(contextmenuEvent)
      }
    })
  }
}

function isTextFields(htmlElement) {
  return (
    htmlElement instanceof HTMLInputElement ||
    htmlElement instanceof HTMLTextAreaElement
  )
}
