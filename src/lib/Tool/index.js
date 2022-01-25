import EditorContainer from './EditorContainer'
import selectUnselectEditorOn from './selectUnselectEditorOn'
import Veil from './Veil'
import throttle from 'throttleit'

// The tool manages interactions between components.
export default class Tool {
  constructor() {
    this._editors = new EditorContainer()
    this._veil = new Veil()

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () => {
      selectUnselectEditorOn(this._editors)
    })

    // Observe window-resize event and redraw all editors.
    window.addEventListener(
      'resize',
      throttle(() => this._editors.redraw(), 500)
    )
  }

  registerEditor(editor) {
    this._editors.push(editor)
    this._veil.setObserver(editor)
  }
}
