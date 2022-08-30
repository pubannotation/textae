import { diff } from 'jsondiffpatch'
import PushButtons from './PushButtons'
import EnableState from './EnableState'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import Buttons from './Buttons'
import isTouchable from '../../isTouchable'
import getPalletButtonTitleFor from '../../getPalletButtonTitleFor'

export default class ControlViewModel {
  constructor(
    eventEmitter,
    selectionModel,
    clipBoard,
    annotationDataEventsObserver,
    originalData,
    typeDefinition
  ) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._annotationDataEventsObserver = annotationDataEventsObserver

    this._originalData = originalData

    this._typeDefinition = typeDefinition

    // Change the title of the palette button to match the edit mode.
    eventEmitter.on('textae-event.edit-mode.transition', (mode) => {
      this._mode = mode
    })
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
    return new Buttons().controlBar.map(({ list }) =>
      list
        .map(({ type, title }) => this._getPalletButtonTitle(type, title))
        .map(({ type, title }) => this._convertToButtonHash(type, title))
    )
  }

  get contextMenuButton() {
    return new Buttons().contextMenu
      .map(({ list }) =>
        list
          .map(({ type, title }) => this._getPalletButtonTitle(type, title))
          .reduce((acc, { type, title }) => {
            if (!isTouchable() && this.getState(type, 'disabled')) {
              return acc
            }

            acc.push(this._convertToButtonHash(type, title))
            return acc
          }, [])
      )
      .filter((list) => list.length)
  }

  getState(name, state) {
    switch (state) {
      case 'pushed':
        return this._pushButtons.get(name).isPushed
      case 'disabled':
        return !this._enableState.get(name)
      case 'transit':
        switch (name) {
          case 'write':
            return this._annotationDataEventsObserver.hasChange
          case 'pallet':
            return this.diffOfConfiguration
          default:
            new Error('Unknown name')
        }
        break
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

  get diffOfConfiguration() {
    return diff(this._originalData.configuration, {
      ...this._originalData.configuration,
      ...this._typeDefinition.config
    })
  }

  setPushBUttons(configuration) {
    if (configuration.autosave === true) {
      this.push('write-auto')
    } else {
      this.release('write-auto')
    }

    if (configuration.autolineheight === false) {
      this.release('line-height-auto')
    } else {
      this.push('line-height-auto')
    }

    if (configuration.boundarydetection === false) {
      this.release('boundary-detection')
    } else {
      this.push('boundary-detection')
    }
  }

  _getPalletButtonTitle(type, title) {
    return type == 'pallet'
      ? { type, title: getPalletButtonTitleFor(this._mode) }
      : { type, title }
  }

  _convertToButtonHash(type, title) {
    return {
      type,
      title,
      pushed: this.getState(type, 'pushed'),
      disabled: this.getState(type, 'disabled'),
      trasit: this.getState(type, 'trasit')
    }
  }
}
