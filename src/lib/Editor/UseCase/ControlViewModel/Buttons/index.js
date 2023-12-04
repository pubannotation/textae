import isTouchable from '../../../isTouchable'
import { definition } from './definition'
import isAndroid from '../../../isAndroid'

function isIOS() {
  // iPad Safari (iPadOS 14 or later) does not include the string iPad in its userAgent.
  // see https://iwb.jp/ipad-safari-javascript-useragent-is-not-ipad/
  return (
    /iPad/.test(navigator.userAgent) ||
    /iPhone/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && isTouchable())
  )
}

export default class Buttons {
  // Buttons to display on the control bar.
  get controlBar() {
    return definition
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
    return definition
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
    return this._buttonList.find(({ type }) => type === 'paste')
  }

  get enabelButtonsWhenSelecting() {
    return this._buttonList.filter((b) => b.enableWhenSelecting)
  }

  get pushButtons() {
    return this._buttonList.filter((b) => b.push).map((b) => b.type)
  }

  get _buttonList() {
    return definition.map(({ list }) => list).flat()
  }
}
