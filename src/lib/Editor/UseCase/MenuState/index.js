import { diff } from 'jsondiffpatch'
import getPalletButtonTitleFor from '../../getPalletButtonTitleFor'
import isTouchable from '../../isTouchable'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import Buttons from './Buttons'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import EnableState from './EnableState'
import PushButtons from './PushButtons'

export default class MenuState {
  #enableState
  #pushButtons
  #annotationModelEventsObserver
  #originalData
  #typeDictionary
  #functionAvailability
  #editModeState

  constructor(
    eventEmitter,
    selectionModel,
    clipBoard,
    annotationModelEventsObserver,
    originalData,
    typeDictionary,
    functionAvailability,
    editModeState
  ) {
    this.#enableState = new EnableState(eventEmitter, selectionModel, clipBoard)
    // Save state of push control buttons.
    this.#pushButtons = new PushButtons(eventEmitter)

    this.#annotationModelEventsObserver = annotationModelEventsObserver
    this.#originalData = originalData
    this.#typeDictionary = typeDictionary
    this.#functionAvailability = functionAvailability
    this.#editModeState = editModeState
  }

  get pushButtonNames() {
    return this.#pushButtons.names
  }

  isPushed(buttonName) {
    return this.#pushButtons.get(buttonName).isPushed
  }

  push(buttonName) {
    this.#pushButtons.get(buttonName).isPushed = true
  }

  release(buttonName) {
    this.#pushButtons.get(buttonName).isPushed = false
  }

  toggleButton(buttonName) {
    return this.#pushButtons.get(buttonName).toggle()
  }

  get textSelectionAdjuster() {
    return this.isPushed('boundary detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }

  get controlBarButton() {
    return new Buttons().controlBar
      .map(({ list }) =>
        list
          .filter(({ type }) => this.#functionAvailability.isAvailable(type))
          .map(({ type, title }) => this.#getPalletButtonTitle(type, title))
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
    return new Buttons()
      .getContextMenuFor(this.#editModeState.currentState)
      .map(({ list }) =>
        list
          .filter(({ type }) => this.#functionAvailability.isAvailable(type))
          .map(({ type, title }) => this.#getPalletButtonTitle(type, title))
          .reduce((acc, { type, title }) => {
            // Do not show menus that are not available in the context menu for desktop.
            if (!isTouchable() && this.getState(type, 'disabled')) {
              return acc
            }

            acc.push(this.#convertToButtonHash(type, title))
            return acc
          }, [])
      )
      .filter((list) => list.length)
  }

  getState(name, state) {
    switch (state) {
      case 'pushed':
        return this.#pushButtons.get(name).isPushed
      case 'disabled':
        return !this.#enableState.get(name)
      case 'transit':
        switch (name) {
          case 'upload':
            return this.#annotationModelEventsObserver.hasChange
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

  updateButtonsToOperateSpanWithTouchDevice(
    enableToCreate,
    enableToExpand,
    enableToShrink,
    enableToEditText
  ) {
    this.#enableState.updateButtonsToOperateSpanWithTouchDevice(
      enableToCreate,
      enableToExpand,
      enableToShrink,
      enableToEditText
    )
  }

  get diffOfConfiguration() {
    return diff(this.#originalData.configuration, {
      ...this.#originalData.configuration,
      ...this.#typeDictionary.config
    })
  }

  setPushButtons(configuration) {
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
    return this.#functionAvailability.isAvailable('show logo')
      ? 'textae-control-details--show-logo'
      : 'textae-control-details--hide-logo'
  }

  #getPalletButtonTitle(type, title) {
    return type === 'pallet'
      ? {
          type,
          title: getPalletButtonTitleFor(this.#editModeState.currentState)
        }
      : { type, title }
  }

  #convertToButtonHash(type, title) {
    return {
      type,
      title,
      pushed: this.getState(type, 'pushed'),
      disabled: this.getState(type, 'disabled'),
      transit: this.getState(type, 'transit')
    }
  }
}
