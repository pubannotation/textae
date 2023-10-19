import dohtml from 'dohtml'
import delegate from 'delegate'
import enableJqueryDraggable from './enableJqueryDraggable'
import getMousePoint from './getMousePoint'
import setWidthWithin from './setWidthWithin'
import setHeightWithin from './setHeightWithin'

export default class Pallet {
  constructor(editorHTMLElement, title) {
    this._editorHTMLElement = editorHTMLElement
    this._title = title
    this._el = this.createElement()

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

  hide() {
    this._el.style.display = 'none'
  }

  get visibly() {
    return this._el.style.display !== 'none'
  }

  createElement() {
    // Add ui-dialog class to prohibit the entity edit dialog from taking the focus.
    const html = `
        <div
          class="textae-editor__pallet ui-dialog"
          style="display: none;"
          >
        </div>`
    return dohtml.create(html)
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
    this._el.style.left = `${this._left}px`
    this._el.style.top = `${this._top}px`
  }

  get _left() {
    const { clientX } = getMousePoint()
    const left = clientX - this._editorHTMLElement.getBoundingClientRect().x

    // Pull left the pallet when the pallet protrudes from right of the editor.
    if (this._maxWidth < left + this._el.offsetWidth) {
      return this._maxWidth - this._el.offsetWidth - 2
    }

    return left
  }

  get _top() {
    const { clientY } = getMousePoint()
    const editorClientY = this._editorHTMLElement.getBoundingClientRect().y

    // Pull up the pallet when the pallet protrudes from bottom of the window.
    if (this._maxHeight < clientY + this._el.offsetHeight) {
      return this._maxHeight - this._el.offsetHeight - editorClientY - 2
    }

    return clientY - editorClientY
  }

  get _maxWidth() {
    return this._editorHTMLElement.offsetWidth
  }

  get _maxHeight() {
    return document.documentElement.clientHeight
  }
}
