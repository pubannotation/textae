import throttle from 'throttleit'
import EditorContainer from './EditorContainer'
import getMousePoint from './getMousePoint'
import observeBodyEvents from './observeBodyEvents'
import Veil from './Veil'

// The tool manages interactions between components.
export default class Tool {
  #editorContainer
  #veil
  #mousePoint

  constructor() {
    this.#editorContainer = new EditorContainer()
    this.#veil = new Veil()
    this.#mousePoint = getMousePoint()

    // When the DOMContentLoaded event occurs, document.body may not have been initialized yet.
    // When the load event occurs, bind the event handler of document.body.
    window.addEventListener('load', () =>
      observeBodyEvents(this.#editorContainer)
    )

    // Observe window-resize event and redraw all editors.
    window.addEventListener(
      'resize',
      throttle(() => {
        this.#editorContainer.reLayout()
        this.#editorContainer.drawGridsInSight()
        this.#editorContainer.updateDenotationEntitiesWidth()
      }, 500)
    )
  }

  get nextID() {
    return this.#editorContainer.nextID
  }

  get mousePoint() {
    return this.#mousePoint
  }

  registerEditor(element, editor) {
    this.#veil.setObserver(element)
    this.#editorContainer.set(element, editor)
  }
}
