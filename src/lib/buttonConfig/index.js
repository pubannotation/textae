import { buttonConfig } from './buttonConfig'

class Config {
  // Map of buttons to display the control bar and context menu.
  get mapForControl() {
    return {
      buttonGroup: buttonConfig.map((list) => ({
        list: list.map((button) => ({ type: button.type, title: button.title }))
      }))
    }
  }

  get _buttons() {
    return buttonConfig.flat()
  }

  _getEnabelButtonsWhenSelecting(type) {
    return this._buttons
      .filter((b) => b.enableWhenSelecting && b.enableWhenSelecting[type])
      .map((b) => b.type)
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

  isEnable(buttonName, selectionModel, clipBoard) {
    return this._buttons
      .find((b) => b.type === buttonName)
      .predicate(selectionModel, clipBoard)
  }
}

export default new Config()
