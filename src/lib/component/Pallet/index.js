import delegate from 'delegate'
import enableJqueryDraggable from './enableJqueryDraggable'
import getMousePoint from './getMousePoint'
import createPalletElement from './createPalletElement'
import setWidthWithin from './setWidthWithin'
import setHeightWithin from './setHeightWithin'

export default class Pallet {
  constructor(editorHTMLElement, title) {
    this._editorHTMLElement = editorHTMLElement
    this._title = title
    this._el = createPalletElement()

    // let the pallet draggable.
    enableJqueryDraggable(this._el, editorHTMLElement)

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
    delegate(this._el, '[type="button"]', 'click', () =>
      editorHTMLElement.focus()
    )

    delegate(this._el, '.textae-editor__pallet__close-button', 'click', () =>
      this.hide()
    )
  }

  updateDisplay() {
    if (this.visibly) {
      this._updateDisplay()
    }
  }

  get el() {
    return this._el
  }

  show() {
    this._el.style.display = 'block'
    this._updateDisplay()

    this._moveInto()
  }

  _updateDisplay() {
    // Wrap the content in a special class so that you can determine if the target of the event is an element of the palette
    // even after the content has been removed from the DOM tree.
    // The taxtae-editor deselects itself when a click event to something other than taxtae-editor occurs.
    // After updating the palette, the click event reaches the body.
    // At that time, if the target of the event is the palette, you can see that it is an event for textae-editor.
    this._el.innerHTML = `
      <div class="textae-editor__pallet__container">
        <div class="textae-editor__pallet__title-bar ui-widget-header ui-corner-all">
          <span class="textae-editor__pallet__title-string">${this._title}</span>
          <button 
            type="button"
            class="textae-editor__pallet__close-button ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close"
            title="Close">
            <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
            <span class="ui-button-icon-space"> </span>Close
          </button>
        </div>
        <div class="textae-editor__pallet__content">${this._content}</div>
      </div>
    `

    setWidthWithin(this._el, this._maxWidth)
    setHeightWithin(
      this._el.querySelector('.textae-editor__pallet__container'),
      this._maxHeight
    )
  }

  _moveInto() {
    const { left, clientY, pageY } = getMousePoint()

    if (this._el.offsetWidth + left <= this._maxWidth) {
      this._el.style.left = `${left}px`
    } else {
      // Pull left the pallet when the pallet protrudes from right of the editor.
      this._el.style.left = `${
        this._editorHTMLElement.offsetLeft +
        this._maxWidth -
        this._el.offsetWidth -
        2
      }px`
    }

    if (this._el.offsetHeight + clientY <= this._maxHeight) {
      const top = pageY - this._editorHTMLElement.offsetTop
      this._el.style.top = `${top}px`
    } else {
      // Pull up the pallet when the pallet protrudes from bottom of the window.
      const top =
        pageY -
        this._editorHTMLElement.offsetTop -
        (this._el.offsetHeight + clientY - this._maxHeight)
      this._el.style.top = `${top}px`
    }
  }

  get _maxWidth() {
    return this._editorHTMLElement.offsetWidth
  }

  get _maxHeight() {
    return document.documentElement.clientHeight
  }

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }
}
