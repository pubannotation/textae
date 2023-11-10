import EditorContainer from './EditorContainer'
import Veil from './Veil'
import throttle from 'throttleit'
import observeBodyEvents from './observeBodyEvents'
import getMousePoint from './getMousePoint'

// The tool manages interactions between components.
export default class Tool {
  constructor() {
    this._editorContainer = new EditorContainer()
    this._veil = new Veil()
    this._mousePoint = getMousePoint()

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () =>
      observeBodyEvents(this._editorContainer)
    )

    // Observe window-resize event and redraw all editors.
    window.addEventListener(
      'resize',
      throttle(() => {
        this._editorContainer.reLayout()
        this._editorContainer.drawGridsInSight()
        this._editorContainer.updateDenotationEntitiesWidth()
      }, 500)
    )
  }

  get nextID() {
    return this._editorContainer.nextID
  }

  get mousePoint() {
    return this._mousePoint
  }

  registerEditor(element, editor) {
    this._veil.setObserver(element)
    this._editorContainer.set(element, editor)
  }
}
