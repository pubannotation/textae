import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import redrawOnResize from './redrawOnResize'
import dohtml from 'dohtml'

// The tool manages interactions between components.
export default class Tool {
  constructor() {
    this._editors = new EditorContainer()
    this._veil = new Veil()
    redrawOnResize(this._editors)

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () => {
      selectUnselectEditorOn(this._editors)
    })
  }

  registerEditor(editor) {
    this._editors.push(editor)
    this._veil.setObserver(editor)
  }
}

class Veil {
  constructor() {
    // Since not all editors will be notified at once, keep the state in a instance variable.
    this._waitingEditors = new Set()
  }

  setObserver(editor) {
    // Do not create HTML elements in the constructor
    // so that this class can be initialized before document.body is created.
    // Instead, we create it here.
    if (!this._el) {
      this._el = dohtml.create(
        `<div class="textae-editor-veil" style="display: none;"></div>`
      )
      document.body.appendChild(this._el)
    }

    new MutationObserver((mutationRecords) => {
      mutationRecords.forEach(({ target: element }) => {
        if (element.classList.contains('textae-editor--wait')) {
          this._waitingEditors.add(element)
        } else {
          this._waitingEditors.delete(element)
        }
      })

      if (this._waitingEditors.size > 0) {
        this._el.style.display = 'block'
      } else {
        this._el.style.display = 'none'
      }
    }).observe(editor[0], config)
  }
}

const config = {
  attributes: true,
  attributeFilter: ['class']
}
