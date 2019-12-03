import { EventEmitter } from 'events'
import enableJqueryDraggable from './enableJqueryDraggable'
import moveIntoWindow from './moveIntoWindow'
import updateDisplay from './updateDisplay'

export default class extends EventEmitter {
  constructor(editor, el) {
    super()

    this._el = el

    // let the pallet draggable.
    enableJqueryDraggable(el, editor)

    this.hide()
  }

  updateDisplay() {
    if (this.visibly) {
      updateDisplay(this._el, this._content)
    }
  }

  get el() {
    return this._el
  }

  show(point) {
    console.assert(point, 'point is necessary.')

    this._el.style.display = 'block'
    updateDisplay(this._el, this._content)
    moveIntoWindow(this._el, point)
  }

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
