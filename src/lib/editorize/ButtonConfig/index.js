import isTouchDevice from '../isTouchDevice'
import { config } from './config'
import deepcopy from 'deepcopy'
import { MODE } from '../../MODE'

function isResolusionLessThanIPadPro() {
  // The resolution is based on the resolution of the iPad Pro
  // when it is in landscape orientation.
  return window.screen.width <= 1366
}

export default class ButtonConfig {
  constructor(eventEmitter) {
    // Copy it to keep the state for each editor.
    this._config = deepcopy(config)

    // Change the title of the palette button to match the edit mode.
    if (eventEmitter) {
      eventEmitter.on('textae-event.edit-mode.transition', (mode) => {
        let title = ''
        switch (mode) {
          case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
          case MODE.EDIT_DENOTATION_WITH_RELATION:
          case MODE.EDIT_BLOCK_WITHOUT_RELATION:
          case MODE.EDIT_BLOCK_WITH_RELATION:
            title = 'Entity Configuration'
            break
          case MODE.EDIT_RELATION:
            title = 'Relation Configuration'
            break
          default:
            title = ''
        }

        this._buttons.find(({ type }) => type === 'pallet').title = title
        eventEmitter.emit(
          'textae-event.control.pallet-button.change-title',
          title
        )
      })
    }
  }

  // Buttons to display on the control bar.
  get controlBar() {
    return this._config
      .filter(({ usage }) => {
        if (isTouchDevice() && isResolusionLessThanIPadPro()) {
          return usage['touce device'].includes('control bar')
        } else {
          return usage['keyboard device'].includes('control bar')
        }
      })
      .map(({ list }) => ({
        list: list.map((button) => ({
          type: button.type,
          title: button.title
        }))
      }))
  }

  // Buttons to display on the context menu.
  get contextMenu() {
    return this._config
      .filter(({ usage }) => {
        if (isTouchDevice()) {
          return usage['touce device'].includes('context menu')
        } else {
          return usage['keyboard device'].includes('context menu')
        }
      })
      .map(({ list }) => ({
        list: list.map((button) => ({
          type: button.type,
          title: button.title
        }))
      }))
  }

  get pasteButton() {
    return this._buttons.find(({ type }) => type === 'paste')
  }

  get enabelButtonsWhenSelecting() {
    return this._buttons.filter((b) => b.enableWhenSelecting)
  }

  get pushButtons() {
    return this._buttons.filter((b) => b.push).map((b) => b.type)
  }

  get _buttons() {
    return this._config.map(({ list }) => list).flat()
  }
}
