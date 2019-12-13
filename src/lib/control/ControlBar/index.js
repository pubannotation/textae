import BUTTON_MAP from '../buttonMap'
import toButtonList from '../toButtonList'
import createElement from './createElement'
import updateAllButtonEnableState from '../updateAllButtonEnableState'
import updateButtonPushState from '../updateButtonPushState'
import transitButtonImage from './transitButtonImage'
import bindEventHandler from '../bindEventHandler'

// The control is a control bar in an editor.
export default class {
  constructor(eventEmitter) {
    this._el = createElement()
    bindEventHandler(this._el, eventEmitter)

    this._buttonList = toButtonList(BUTTON_MAP)
  }

  get el() {
    return this._el
  }

  updateAllButtonEnableState(enableButtons) {
    updateAllButtonEnableState(this._el, this._buttonList, enableButtons)
  }

  updateButtonPushState(buttonType, isPushed) {
    updateButtonPushState(this._el, buttonType, isPushed)
  }

  transitButtonImage(transitButtons) {
    transitButtonImage(this._el, this._buttonList, transitButtons)
  }
}
