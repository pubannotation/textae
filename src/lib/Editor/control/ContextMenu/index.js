import dohtml from 'dohtml'
import isTouchable from '../../isTouchable'
import classify from '../classify'
import Control from '../Control'
import toContextMenuItem from './toContextMenuItem'

export default class ContextMenu extends Control {
  constructor(editorHTMLElement, buttonController, iconEventMap) {
    super(
      `<div class="textae-control ${
        isTouchable() ? 'textae-android-context-menu' : 'textae-context-menu'
      }"></div>`,
      iconEventMap
    )

    this._editorHTMLElement = editorHTMLElement
    this._buttonController = buttonController
  }

  show(contextmenuEvent) {
    const selection = window.getSelection()

    if (isTouchable() && selection.rangeCount === 1) {
      const rectOfSelection = selection.getRangeAt(0).getBoundingClientRect()
      const rectOfTextBox = this._editorHTMLElement
        .querySelector('.textae-editor__text-box')
        .getBoundingClientRect()

      this._showAbove(
        rectOfSelection.y - this._editorHTMLElement.getBoundingClientRect().y,
        rectOfSelection.x - rectOfTextBox.x
      )
    } else {
      // The context menu is `position:absolute` in the editor.
      // I want the coordinates where you right-click with the mouse,
      // starting from the upper left of the editor.
      // So the Y coordinate is pageY minus the editor's offsetTop.
      this._showLowerRight(
        contextmenuEvent.pageY - this._editorHTMLElement.offsetTop,
        contextmenuEvent.pageX
      )
    }
  }

  hide() {
    if (this._isOpen) {
      super.el.classList.remove('textae-context-menu--show')
      super.el.classList.add('textae-context-menu--hide')
    }
  }

  get _isOpen() {
    return super.el.classList.contains('textae-context-menu--show')
  }

  _showAbove(positionTop, positionLeft) {
    this._show()

    const { height } = this.el.getBoundingClientRect()
    super.el.setAttribute(
      'style',
      `top: ${positionTop - height}px; left: ${positionLeft}px`
    )
  }

  _showLowerRight(positionTop, positionLeft) {
    this._show()

    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
  }

  _show() {
    const context = classify(this._buttonController.contextMenuButton)
    const html = `
    <div">
      ${context
        .map((list) => list.map(toContextMenuItem).join(''))
        .join('<p class="textae-control-separator"></p>\n')}
    </div>
    `
    super.el.replaceChildren(...dohtml.create(html).children)
    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')
  }
}
