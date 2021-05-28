import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'

export default class ButtonController {
  constructor(editor, selectionModel, clipBoard) {
    this._enableState = new EnableState(editor, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(editor)
  }

  propagate() {
    this._enableState.propagate()
    this._pushButtons.propagate()
  }

  get pushButtonNames() {
    return this._pushButtons.names
  }

  valueOf(buttonName) {
    return this._getPushButton(buttonName).value()
  }

  push(buttonName) {
    this._getPushButton(buttonName).value(true)
  }

  release(buttonName) {
    this._getPushButton(buttonName).value(false)
  }

  toggle(buttonName) {
    return this._getPushButton(buttonName).toggle()
  }

  get spanAdjuster() {
    return this.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }

  _getPushButton(buttonName) {
    return this._pushButtons.getButton(buttonName)
  }
}
