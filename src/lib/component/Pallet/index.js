import delegate from 'delegate'
import enableJqueryDraggable from './enableJqueryDraggable'
import moveIntoWindow from './moveIntoWindow'
import updateDisplay from './updateDisplay'
import getMousePoint from './getMousePoint'
import createPalletElement from './createPalletElement'

export default class Pallet {
  constructor(editor, annotationType) {
    this._editor = editor
    this._annotationType = annotationType
    this._el = createPalletElement(annotationType)

    // let the pallet draggable.
    enableJqueryDraggable(this._el, editor)

    // bugfix: Shortcut keys do not work after operating palette buttons.
    //
    // Some browsers focus button at clicking it.
    // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#Clicking_and_focus
    // There are hacks that can override this behavior.
    // See: https://stackoverflow.com/questions/8735764/prevent-firing-focus-event-when-clicking-on-div
    // Simply refocus the editor for the following reasons:
    // 1. It's hard to see which browsers are hack-enabled using mousedown + preventDefault
    // 2. preventDefault changes default operations other than focus. Difficult to investigate impact range
    // 3. Operations that focus on a specific DOM element will work in any browser
    // 4. Refocusing on a focused DOM element has no side effects
    delegate(this._el, '[type="button"]', 'click', () => editor.focus())

    delegate(
      this._el,
      `.textae-editor__type-pallet__read-button`,
      'click',
      () => editor.eventEmitter.emit('textae.pallet.read-button.click')
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__write-button',
      'click',
      () => editor.eventEmitter.emit('textae.pallet.write-button.click')
    )

    this.hide()
  }

  updateDisplay() {
    if (this.visibly) {
      updateDisplay(this._editor, this._el, this._annotationType, this._content)
    }
  }

  get el() {
    return this._el
  }

  show() {
    this._el.style.display = 'block'
    updateDisplay(this._editor, this._el, this._annotationType, this._content)

    const point = getMousePoint()
    // point.top -= this._editor[0].offsetTop
    moveIntoWindow(this._editor, this._el, point)
  }

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
