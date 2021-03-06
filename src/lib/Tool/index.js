import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import redrawOnResize from './redrawOnResize'
import Veil from './Veil'

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
