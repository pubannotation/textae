import isTouchDevice from '../isTouchDevice'
import { config } from './config'

function isResolusionLessThanIPadPro() {
  // The resolution is based on the resolution of the iPad Pro
  // when it is in landscape orientation.
  return window.screen.width <= 1366
}

class Config {
  // Buttons to display on the control bar.
  get controlBar() {
    return config
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
    return config
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
    return config.map(({ list }) => list).flat()
  }
}

export default new Config()
