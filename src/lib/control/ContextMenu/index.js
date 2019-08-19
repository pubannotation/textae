import $ from 'jquery'
import push from '../push'
import unpush from '../unpush'
import BUTTON_MAP from '../buttonMap'
import makeButtons from './makeButtons'
import toButtonList from '../toButtonList'
import updateButtons from '../updateButtons'

export default class {
  constructor(editor) {
    this.editor = editor[0]
    this.className = 'textae-context-menu'
    this.buttonList = toButtonList(BUTTON_MAP)
    // Buttons that always enable.
    this.ALWAYS_ENABLES = {
      read: true,
      write: true,
      help: true
    }
    this[0] = this.create()
    this.$control = $(this[0])
  }
  create() {
    const div = document.createElement('div')
    div.classList.add('textae-control')
    div.classList.add(this.className)
    makeButtons(div, BUTTON_MAP)

    return div
  }
  show(positionTop, positionLeft) {
    const menuNode = this.getContextMenuNode()
    menuNode.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
    menuNode.classList.remove(`${this.className}--hide`)
    menuNode.classList.add(`${this.className}--show`)
  }
  hide() {
    if (this.isOpen()) {
      const menuNode = this.getContextMenuNode()
      menuNode.classList.remove(`${this.className}--show`)
      menuNode.classList.add(`${this.className}--hide`)
    }
  }
  isOpen() {
    return this.getContextMenuNode().classList.contains(
      `${this.className}--show`
    )
  }
  updateAllButtonEnableState(enableButtons) {
    // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
    const enables = Object.assign(
      {},
      this.buttonList,
      this.ALWAYS_ENABLES,
      enableButtons
    )

    // A function to enable/disable button.
    updateButtons(this.$control, this.buttonList, enables)
  }
  updateButtonPushState(buttonType, isPushed) {
    if (isPushed) {
      push(this.$control, buttonType)
    } else {
      unpush(this.$control, buttonType)
    }
  }
  getContextMenuNode() {
    return this.editor.querySelector(`.${this.className}`)
  }
}
