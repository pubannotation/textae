import delegate from 'delegate'
import enableJqueryDraggable from './enableJqueryDraggable'
import getMousePoint from './getMousePoint'
import createPalletElement from './createPalletElement'
import setWidthWithin from './setWidthWithin'
import setHeightWithin from './setHeightWithin'

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

    delegate(
      this._el,
      '.textae-editor__type-pallet__close-button',
      'click',
      () => this.hide()
    )

    this.hide()
  }

  updateDisplay() {
    if (this.visibly) {
      this._updateDisplay(this._el, this._annotationType)
    }
  }

  get el() {
    return this._el
  }

  show() {
    this._el.style.display = 'block'
    this._updateDisplay(this._el, this._annotationType)

    this._moveInto(this._editor, this._el)
  }

  _updateDisplay(pallet, annotationType) {
    // Wrap the content in a special class so that you can determine if the target of the event is an element of the palette
    // even after the content has been removed from the DOM tree.
    // The taxtae-editor deselects itself when a click event to something other than taxtae-editor occurs.
    // After updating the palette, the click event reaches the body.
    // At that time, if the target of the event is the palette, you can see that it is an event for textae-editor.
    pallet.innerHTML = `
      <div class="textae-editor__type-pallet__title-bar ui-widget-header ui-corner-all">
        <span>${
          annotationType.charAt(0).toUpperCase() + annotationType.slice(1)
        } configuration</span>
        <button 
          type="button"
          class="textae-editor__type-pallet__close-button ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close"
          title="Close">
          <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
          <span class="ui-button-icon-space"> </span>Close
        </button>
      </div>
      <div class="textae-editor__type-pallet__content">${this._content}</div>
    `

    setWidthWithin(pallet, this._maxWidth)
    setHeightWithin(pallet, this._maxHeight)
  }

  _moveInto(editor, pallet) {
    const { left, clientY, pageY } = getMousePoint()

    if (pallet.offsetWidth + left <= this._maxWidth) {
      pallet.style.left = `${left}px`
    } else {
      // Pull left the pallet when the pallet protrudes from right of the editor.
      pallet.style.left = `${
        editor[0].offsetLeft + this._maxWidth - pallet.offsetWidth - 2
      }px`
    }

    if (pallet.offsetHeight + clientY <= this._maxHeight) {
      const top = pageY - editor[0].offsetTop
      pallet.style.top = `${top}px`
    } else {
      // Pull up the pallet when the pallet protrudes from bottom of the window.
      const top =
        pageY -
        editor[0].offsetTop -
        (pallet.offsetHeight + clientY - this._maxHeight)
      pallet.style.top = `${top}px`
    }
  }

  get _maxWidth() {
    return this._editor[0].offsetWidth
  }

  get _maxHeight() {
    return window.innerHeight
  }

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
