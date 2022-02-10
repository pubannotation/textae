import EditorContainer from './EditorContainer'
import Veil from './Veil'
import throttle from 'throttleit'
import debounce from 'debounce'

// The tool manages interactions between components.
export default class Tool {
  constructor() {
    this._editorContainer = new EditorContainer()
    this._veil = new Veil()

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () =>
      this._editorContainer.observeBodyEvents()
    )

    // Observe window-resize event and redraw all editors.
    window.addEventListener(
      'resize',
      throttle(() => {
        this._editorContainer.relayout()
        this._editorContainer.drawGridsInSight()
        this._editorContainer.updateDenotationEntitiesWidth()
      }, 500)
    )

    window.addEventListener(
      'scroll',
      debounce(() => {
        console.log('hi')
        this._editorContainer.drawGridsInSight()
      }, 300)
    )
  }

  get nextID() {
    return this._editorContainer.nextID
  }

  registerEditor(element, editor) {
    this._veil.setObserver(element)
    this._editorContainer.set(element, editor)
  }
}
