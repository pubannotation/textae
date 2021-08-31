import isTouchDevice from '../isTouchDevice'
import { buttonConfig } from './buttonConfig'

class Config {
  // Buttons to display on the control bar.
  get controlBar() {
    return {
      buttonGroup: buttonConfig
        .filter(({ usage }) => {
          if (isTouchDevice()) {
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
  }

  // Buttons to display on the context menu.
  get contextMenu() {
    return {
      buttonGroup: buttonConfig
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
  }

  get _buttons() {
    return buttonConfig.map(({ list }) => list).flat()
  }

  _getEnabelButtonsWhenSelecting(denotationType) {
    return this._buttons
      .filter(
        (b) => b.enableWhenSelecting && b.enableWhenSelecting[denotationType]
      )
      .map((b) => ({
        name: b.type,
        predicate: b.enableWhenSelecting[denotationType]
      }))
  }

  get spanButtons() {
    return this._getEnabelButtonsWhenSelecting('span')
  }

  get entityButtons() {
    return this._getEnabelButtonsWhenSelecting('entity')
  }

  get relationButtons() {
    return this._getEnabelButtonsWhenSelecting('relation')
  }

  get pushButtons() {
    return this._buttons.filter((b) => b.push).map((b) => b.type)
  }
}

export default new Config()
