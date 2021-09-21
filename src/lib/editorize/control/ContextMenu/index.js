import dohtml from 'dohtml'
import isTouchDevice from '../../isTouchDevice'
import classify from '../classify'
import Control from '../Control'
import bindToWindowEvents from './bindToWindowEvents'
import toContextMenuItem from './toContextMenuItem'

export default class ContextMenu extends Control {
  constructor(editor, buttonController) {
    super(
      editor,
      `<div class="textae-control ${
        isTouchDevice() ? 'textae-android-context-menu' : 'textae-context-menu'
      }"></div>`
    )

    bindToWindowEvents(editor, this)

    this._editor = editor
    this._buttonController = buttonController
  }

  showLowerRight(positionTop, positionLeft) {
    this._show()

    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
  }

  showAbove(positionTop, positionLeft) {
    this._show()

    const { height } = this.el.getBoundingClientRect()
    super.el.setAttribute(
      'style',
      `top: ${positionTop - height}px; left: ${positionLeft}px`
    )
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
