import dohtml from 'dohtml'
import bindEventHandler from './bindEventHandler'
import updateAllButtonEnableState from './updateAllButtonEnableState'
import updateButtonPushState from './updateButtonPushState'

// The control is a control bar in an editor.
export default class Control {
  constructor(editor, html) {
    const el = dohtml.create(html)

    this._el = el
    bindEventHandler(this._el, editor)
  }

  get el() {
    return this._el
  }

  updateAllButtonEnableState(enableButtons) {
    updateAllButtonEnableState(this._el, enableButtons)
  }

  updateButtonPushState(buttonType, isPushed) {
    updateButtonPushState(this._el, buttonType, isPushed)
  }
}
