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
  setObserver(editor) {
    // Do not create HTML elements in the constructor
    // so that this class can be initialized before document.body is created.
    // Instead, we create it here.
    if (!this._el) {
      this._el = dohtml.create(
        `<div class="${veilClass}" style="display: none;"></div>`
      )
      document.body.appendChild(this._el)
    }

    setVeilObserver(editor, this._el)
  }
}

// Since not all editors will be notified at once, keep the state in a module scope variable.
const waitingEditors = new Set()
const veilClass = 'textae-editor-veil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

function setVeilObserver(editor, veil) {
  new MutationObserver((mutationRecords) => {
    mutationRecords.forEach(({ target: element }) => {
      if (element.classList.contains('textae-editor--wait')) {
        waitingEditors.add(element)
      } else {
        waitingEditors.delete(element)
      }
    })

    if (waitingEditors.size > 0) {
      veil.style.display = 'block'
    } else {
      veil.style.display = 'none'
    }
  }).observe(editor[0], config)
}
