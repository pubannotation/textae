import isTouchable from '../isTouchable'
import { config } from './config'
import deepcopy from 'deepcopy'
import isAndroid from '../isAndroid'

function isIOS() {
  // iPad Safari (iPadOS 14 or later) does not include the string iPad in its userAgent.
  // see https://iwb.jp/ipad-safari-javascript-useragent-is-not-ipad/
  return (
    /iPad/.test(navigator.userAgent) ||
    /iPhone/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && isTouchable())
  )
}

export default class ButtonConfig {
  constructor() {
    // Copy it to keep the state for each editor.
    this._config = deepcopy(config)
  }

  // Buttons to display on the control bar.
  get controlBar() {
    return this._config
      .filter(({ usage }) => {
        // To make it easier to guess the result, don't use the screen size to judge the device.
        if (isAndroid() || isIOS()) {
          return usage['touce device'].includes('control bar')
        } else {
          return usage['keyboard device'].includes('control bar')
        }
      })
      .map(({ list }) => ({
        list: list.map(({ type, title }) => ({
          type,
          title
        }))
      }))
  }

  // Buttons to display on the context menu.
  get contextMenu() {
    return this._config
      .filter(({ usage }) => {
        if (isTouchable()) {
          return usage['touce device'].includes('context menu')
        } else {
          return usage['keyboard device'].includes('context menu')
        }
      })
      .map(({ list }) => ({
        list: list.map(({ type, title }) => ({
          type,
          title
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

  set palletButtonTitle(value) {
    this._buttons.find(({ type }) => type === 'pallet').title = value
  }
}
