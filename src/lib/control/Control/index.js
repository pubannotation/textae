import dohtml from 'dohtml'
import bindEventHandler from './bindEventHandler'
import updateAllButtonEnableState from './updateAllButtonEnableState'
import updateButtonPushState from './updateButtonPushState'
import toContentHtml from './toContentHtml/toContentHtml'

// The control is a control bar in an editor.
export default class {
  constructor(htmlTemplate, eventEmitter) {
    const el = dohtml.create(toContentHtml(htmlTemplate))

    this._el = el
    bindEventHandler(this._el, eventEmitter)
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
