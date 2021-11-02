import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import ButtonConfig from '../../ButtonConfig'
import isTouchDevice from '../../isTouchDevice'

export default class ButtonController {
  constructor(eventEmitter, selectionModel, clipBoard, annotationWatcher) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._annotationWatcher = annotationWatcher
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

  get controlBarButton() {
    return new ButtonConfig().controlBar.map(({ list }) => {
      const ret = []
      for (const { type, title } of list) {
        ret.push({
          type,
          title,
          pushed: this.getState(type, 'pushed'),
          disabled: this.getState(type, 'disabled'),
          trasit: this.getState(type, 'trasit')
        })
      }

      return ret
    })
  }

  get contextMenuButton() {
    return new ButtonConfig().contextMenu
      .map(({ list }) => {
        const ret = []
        for (const { type, title } of list) {
          if (!isTouchDevice() && this.getState(type, 'disabled')) {
            continue
          }

          ret.push({
            type,
            title,
            pushed: this.getState(type, 'pushed'),
            disabled: this.getState(type, 'disabled'),
            trasit: this.getState(type, 'trasit')
          })
        }

        return ret
      })
      .filter((list) => list.length)
  }

  getState(name, state) {
    switch (state) {
      case 'pushed':
        return this._pushButtons.get(name).isPushed
      case 'disabled':
        return !this._enableState.get(name)
      case 'transit':
        return name === 'write' && this._annotationWatcher.hasChange
      default:
        new Error('Unknown state')
    }
  }

  updateManipulateSpanButtons(enableToCreate, enableToExpand, enableToShrink) {
    this._enableState.updateManipulateSpanButtons(
      enableToCreate,
      enableToExpand,
      enableToShrink
    )
  }
}
