import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import redrawOnResize from './redrawOnResize'
import dohtml from 'dohtml'

// The tool manages interactions between components.
export default class Tool {
  constructor() {
    this._editors = new EditorContainer()
    redrawOnResize(this._editors)

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () => {
      selectUnselectEditorOn(this._editors)
    })
  }

  registerEditor(editor) {
    const veil = document.querySelector(`.${veilClass}`)
    if (!veil) {
      document.body.appendChild(
        dohtml.create(`<div class="${veilClass}" style="display: none;"></div>`)
      )
    }

    this._editors.push(editor)
    setVeilObserver(editor)
  }
}

// Since not all editors will be notified at once, keep the state in a module scope variable.
const waitingEditors = new Set()
const veilClass = 'textae-editor-veil'

const config = {
  attributes: true,
  attributeFilter: ['class']
}

function setVeilObserver(editor) {
  new MutationObserver((mutationRecords) => {
    mutationRecords.forEach(({ target: element }) => {
      if (element.classList.contains('textae-editor--wait')) {
        waitingEditors.add(element)
      } else {
        waitingEditors.delete(element)
      }
    })

    if (waitingEditors.size > 0) {
      const veil = document.querySelector(`.${veilClass}`)

      if (veil) {
        veil.style.display = 'block'
      }
    } else {
      const veil = document.querySelector(`.${veilClass}`)

      if (veil) {
        veil.style.display = 'none'
      }
    }
  }).observe(editor[0], config)
}
