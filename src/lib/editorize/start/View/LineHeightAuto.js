export default class LineHeightAuto {
  constructor(eventEmitter, textBox) {
    this._textBox = textBox
    this._enable = false

    eventEmitter.on(
      'textae-event.control.button.push',
      ({ buttonName, state }) => {
        if (buttonName === 'line-height-auto') {
          this._enable = state
        }
      }
    )
  }

  updateLineHeight() {
    if (this._enable) {
      this._textBox.updateLineHeight()
    }
  }
}
