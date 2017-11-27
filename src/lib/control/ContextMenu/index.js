import BUTTON_MAP from '../buttonMap'
import makeButtons from './makeButtons'
import toButtonList from '../toButtonList'
import * as cssUtil from '../iconCssUtil'
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
    this.closing = false
  }
  create() {
    let div = document.createElement('div')
    div.classList.add('textae-control')
    div.classList.add(this.className)
    makeButtons(div, BUTTON_MAP)

    return div
  }
  show(positionTop, positionLeft) {
    let menuNode = this.getContextMenuNode()
    menuNode.setAttribute('style', 'top: ' + positionTop + 'px; left: ' + positionLeft + 'px')
    menuNode.classList.remove(this.className + '--hide')
    menuNode.classList.add(this.className + '--show')
  }
  hide() {
    if (!this.closing) {
      return
    }

    let menuNode = this.getContextMenuNode()
    menuNode.classList.remove(this.className + '--show')
    menuNode.classList.add(this.className + '--hide')
    this.closing = false
  }
  isOpen() {
    return this.getContextMenuNode().classList.contains(this.className + '--show')
  }
  updateAllButtonEnableState(enableButtons) {
        // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
    const enables = Object.assign({}, this.buttonList, this.ALWAYS_ENABLES, enableButtons)

    // A function to enable/disable button.
    updateButtons(this.$control, this.buttonList, enables)
  }
  updateButtonPushState(buttonType, isPushed) {
    if (isPushed) {
      cssUtil.push(this.$control, buttonType)
    } else {
      cssUtil.unpush(this.$control, buttonType)
    }
  }
  getContextMenuNode() {
    return this.editor.querySelector('.' + this.className)
  }
}
