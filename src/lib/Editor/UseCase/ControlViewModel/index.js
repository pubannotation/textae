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
    annotationModelEventsObserver,
    originalData,
    typeDefinition,
    functionAvailability
  ) {
    this._enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(eventEmitter)

    this._annotationModelEventsObserver = annotationModelEventsObserver

    this._originalData = originalData

    this._typeDefinition = typeDefinition

    this._functionAvailability = functionAvailability

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
    return this.isPushed('boundary detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }

  get controlBarButton() {
    return new Buttons().controlBar
      .map(({ list }) =>
        list
          .filter(({ type }) => this._functionAvailability.get(type))
          .map(({ type, title }) => this._getPalletButtonTitle(type, title))
          .map(({ type, title }) => ({
            type,
            title,
            pushed: this.getState(type, 'pushed'),
            disabled: this.getState(type, 'disabled')
            // The status of transit cannot be referenced at the time of initialization.
            // The _convertToButtonHash method cannot be used.
          }))
      )
      .filter((list) => list.length)
  }

  get contextMenuButton() {
    return new Buttons().contextMenu
      .map(({ list }) =>
        list
          .filter(({ type }) => this._functionAvailability.get(type))
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
          case 'upload':
            return this._annotationModelEventsObserver.hasChange
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
      this.push('upload automatically')
    } else {
      this.release('upload automatically')
    }

    if (configuration.autolineheight === false) {
      this.release('auto adjust lineheight')
    } else {
      this.push('auto adjust lineheight')
    }

    if (configuration.boundarydetection === false) {
      this.release('boundary detection')
    } else {
      this.push('boundary detection')
    }
  }

  get detailModifierClassName() {
    return this._functionAvailability.get('show logo')
      ? 'textae-control-details--show-logo'
      : 'textae-control-details--hide-logo'
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
      transit: this.getState(type, 'transit')
    }
  }
}
