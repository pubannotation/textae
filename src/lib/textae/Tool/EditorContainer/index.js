import debounce from 'debounce'
import delegate from 'delegate'
import throttle from 'throttleit'
import HelpDialog from '../../../component/HelpDialog'
import TipsDialog from '../../../component/TipsDialog'
import isTextFields from './isTextFields'

const helpDialog = new HelpDialog()
const tipsDialog = new TipsDialog()

export default class EditorContainer {
  #editors
  #selected
  #counter

  constructor() {
    this.#editors = new Map()
    this.#selected = null
    this.#counter = 0

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

    this.#observeDocumentEvents()
  }

  set(element, editor) {
    this.#editors.set(element, editor)
    this.#counter++
  }

  remove(element) {
    this.#editors.get(element).dispose()
    this.#editors.delete(element)

    if (this.selected === element) {
      this.#selected = null
    }
  }

  get selected() {
    return this.#selected
  }

  set selected(element) {
    if (element === null) {
      this.#selectedEditor.deactivate()
      this.#selected = null
    } else {
      this.#selected = element
      this.#selectedEditor.activate()
    }
  }

  drawGridsInSight() {
    for (const editor of this.#editors.values()) {
      editor.drawGridsInSight()
    }
  }

  updateDenotationEntitiesWidth() {
    for (const editor of this.#editors.values()) {
      editor.updateDenotationEntitiesWidth()
    }
  }

  reLayout() {
    for (const editor of this.#editors.values()) {
      editor.reLayout()
    }
  }

  has(element) {
    return this.#editors.has(element)
  }

  get nextID() {
    return `editor${this.#counter}`
  }

  #observeDocumentEvents() {
    document.addEventListener(
      'scroll',
      throttle(() => {
        this.drawGridsInSight()
      }, 300)
    )

    // Since the Body element does not yet exist at the time of initializing the EditorContainer,
    // we will set up an event handler in the document.
    document.addEventListener('copy', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.#editors.get(this.selected).copyEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('cut', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.#editors.get(this.selected).cutEntitiesToSystemClipboard(e)
      }
    })
    document.addEventListener('paste', (e) => {
      if (isTextFields(e.target)) {
        return
      }

      if (this.selected) {
        this.#editors.get(this.selected).pasteEntitiesFromSystemClipboard(e)
      }
    })

    // Enable/disable the context menu icon by looking at the text selection.
    document.addEventListener(
      'selectionchange',
      debounce(() => {
        if (this.selected) {
          this.#editors.get(this.selected).applyTextSelectionWithTouchDevice()
        }
      }, 100)
    )
    document.addEventListener('contextmenu', () => {
      if (this.selected) {
        this.#editors.get(this.selected).applyTextSelectionWithTouchDevice()
      }
    })

    // Close ContextMenu when another editor is clicked
    document.addEventListener('click', (e) => {
      // In Firefox, the right button of mouse fires a 'click' event.
      // https://stackoverflow.com/questions/43144995/mouse-right-click-on-firefox-triggers-click-event
      // In Firefox, MouseEvent has a 'which' property, which is 3 when the right button is clicked.
      // https://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
      if (e.which === 3) {
        return
      }

      for (const api of this.#editors.values()) {
        api.hideContextMenu()
      }
    })

    document.addEventListener('contextmenu', (contextmenuEvent) => {
      // Close ContextMenu when another editor is clicked.
      for (const api of this.#editors.values()) {
        api.hideContextMenu()
      }

      // If the editor you click on is selected and editable,
      // it will display its own context menu, rather than the browser's context menu.
      const clickedEditor = contextmenuEvent.target.closest('.textae-editor')
      if (clickedEditor === this.#selected) {
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
        this.#selectedEditor.showContextMenu(contextmenuEvent)
      }
    })
  }

  get #selectedEditor() {
    return this.#editors.get(this.#selected)
  }
}
