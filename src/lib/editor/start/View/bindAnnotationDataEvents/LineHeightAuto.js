export default class LineHeightAuto {
  constructor(editor, textBox) {
    this._textBox = textBox
    this._enable = false

    editor.eventEmitter.on(
      'textae.control.button.push',
      ({ buttonName, state }) => {
        if (buttonName === 'line-height-auto') {
          this._enable = state
        }
      }
    )
  }

  updateLineHeight(gridRectangle) {
    if (this._enable) {
      this._textBox.updateLineHeight(gridRectangle)
    }
  }
}
