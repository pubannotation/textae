import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import buttonConfig from '../../buttonConfig'

class ContextMenuButton {
  constructor(pushButtonState, enableButtonState, transitButtonState) {
    this._pushButtonsState = pushButtonState
    this._enableButtonsState = enableButtonState
    this._transitButtonsState = transitButtonState
  }

  get state() {
    return buttonConfig.contextMenu.buttonGroup.map(({ list }) => {
      const ret = []
      for (const { type, title } of list) {
        ret.push({
          type,
          title,
          pushed: this._pushButtonsState.get(type),
          disabled: !this._enableButtonsState.get(type),
          trasit: this._transitButtonsState.get(type)
        })
      }

      return ret
    })
  }
}

export default class ButtonController {
  constructor(eventEmitter, selectionModel, clipBoard) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._enableButtonsState = new Map()
    this._pushButtonsState = new Map()
    this._transitButtonsState = new Map()

    eventEmitter
      .on('textae-event.control.button.push', (data) =>
        this._pushButtonsState.set(data.buttonName, data.state)
      )
      .on(
        'textae-event.control.buttons.change',
        (enableButtons) => (this._enableButtonsState = enableButtons)
      )
      .on('textae-event.control.writeButton.transit', (isTransit) => {
        this._transitButtonsState.set('write', isTransit)
      })
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

  toggleButton(buttonName) {
    return this._getPushButton(buttonName).toggle()
  }

  get spanAdjuster() {
    return this.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }

  get contextMenuButton() {
    return new ContextMenuButton(
      this._pushButtonsState,
      this._enableButtonsState,
      this._transitButtonsState
    ).state
  }

  _getPushButton(buttonName) {
    return this._pushButtons.getButton(buttonName)
  }
}
