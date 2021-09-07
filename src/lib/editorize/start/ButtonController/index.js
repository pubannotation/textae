import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import buttonConfig from '../../buttonConfig'

export default class ButtonController {
  constructor(eventEmitter, selectionModel, clipBoard) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._transitButtonsState = new Map()

    eventEmitter.on('textae-event.control.writeButton.transit', (isTransit) => {
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
    return this._pushButtons.get(buttonName)
  }

  push(buttonName) {
    this._getPushButton(buttonName).pushed = true
  }

  release(buttonName) {
    this._getPushButton(buttonName).pushed = false
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
    return buttonConfig.contextMenu.buttonGroup.map(({ list }) => {
      const ret = []
      for (const { type, title } of list) {
        ret.push({
          type,
          title,
          pushed: this._pushButtons.get(type),
          disabled: !this._enableState.get(type),
          trasit: this._transitButtonsState.get(type)
        })
      }

      return ret
    })
  }

  _getPushButton(buttonName) {
    return this._pushButtons.getButton(buttonName)
  }
}
