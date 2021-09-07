export default class LineHeightAuto {
  constructor(eventEmitter, textBox) {
    this._textBox = textBox
    this._enable = false

    eventEmitter.on(
      'textae-event.control.button.push',
      ({ buttonName, isPushed }) => {
        if (buttonName === 'line-height-auto') {
          this._enable = isPushed
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
