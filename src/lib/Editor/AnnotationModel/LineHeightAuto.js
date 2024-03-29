export default class LineHeightAuto {
  /**
   *
   * @param {import('./createTextBox/TextBox').default} textBox
   */
  constructor(eventEmitter, textBox) {
    this._textBox = textBox
    this._enable = false

    eventEmitter.on(
      'textae-event.control.button.push',
      ({ name, isPushed }) => {
        if (name === 'auto adjust lineheight') {
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
