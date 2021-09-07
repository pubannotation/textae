import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import buttonConfig from '../../buttonConfig'

export default class ButtonController {
  constructor(eventEmitter, selectionModel, clipBoard, annotationWatcher) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._writeButtonTransitState = false
    eventEmitter.on('textae-event.control.writeButton.transit', (isTransit) => {
      this._writeButtonTransitState = isTransit
    })
    this._annotationWatcher = annotationWatcher
  }

  propagate() {
    this._enableState.propagate()
    this._pushButtons.propagate()
  }

  get pushButtonNames() {
    return this._pushButtons.names
  }

  isPushed(buttonName) {
    return this._pushButtons.get(buttonName).isPushed
  }

  push(buttonName) {
    this._pushButtons.get(buttonName).isPushed = true
  }

  release(buttonName) {
    this._pushButtons.get(buttonName).isPushed = false
  }

  toggleButton(buttonName) {
    return this._pushButtons.get(buttonName).toggle()
  }

  get spanAdjuster() {
    return this.isPushed('boundary-detection')
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
          pushed: this._pushButtons.get(type).isPushed,
          disabled: !this._enableState.get(type),
          trasit: type === 'write' && this._annotationWatcher.hasChange
        })
      }

      return ret
    })
  }
}
