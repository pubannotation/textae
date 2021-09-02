export default class LineHeightAuto {
  constructor(editor, textBox) {
    this._textBox = textBox
    this._enable = false

    editor.eventEmitter.on(
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
