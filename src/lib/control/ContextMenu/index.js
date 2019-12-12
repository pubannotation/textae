import BUTTON_MAP from '../buttonMap'
import makeButtons from './makeButtons'
import toButtonList from '../toButtonList'
import bindEventHandler from '../bindEventHandler'
import updateButtonPushState from '../updateButtonPushState'
import updateAllButtonEnableState from '../updateAllButtonEnableState'

export default class {
  constructor(editor, eventEmitter) {
    this._editor = editor[0]
    this._className = 'textae-context-menu'
    this._buttonList = toButtonList(BUTTON_MAP)
    // Buttons that always enable.
    this._ALWAYS_ENABLES = {
      read: true,
      write: true,
      help: true
    }

    this.el = this.create()

    bindEventHandler(this.el, eventEmitter)
  }

  create() {
    const div = document.createElement('div')
    div.classList.add('textae-control')
    div.classList.add(this._className)
    makeButtons(div, BUTTON_MAP)

    return div
  }

  show(positionTop, positionLeft) {
    const menuNode = this.getContextMenuNode()
    menuNode.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
    menuNode.classList.remove(`${this._className}--hide`)
    menuNode.classList.add(`${this._className}--show`)
  }

  hide() {
    if (this.isOpen()) {
      const menuNode = this.getContextMenuNode()
      menuNode.classList.remove(`${this._className}--show`)
      menuNode.classList.add(`${this._className}--hide`)
    }
  }

  isOpen() {
    return this.getContextMenuNode().classList.contains(
      `${this._className}--show`
    )
  }

  updateAllButtonEnableState(enableButtons) {
    updateAllButtonEnableState(this.el, this._buttonList, enableButtons)
  }

  updateButtonPushState(buttonType, isPushed) {
    updateButtonPushState(this.el, buttonType, isPushed)
  }

  getContextMenuNode() {
    return this._editor.querySelector(`.${this._className}`)
  }
}
