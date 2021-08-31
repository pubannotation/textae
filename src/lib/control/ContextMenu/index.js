import Control from '../Control'
import isTouchDevice from '../../isTouchDevice'
import buttonConfig from '../../buttonConfig'
import toMenuItem from './toMenuItem'
import bindContextMenu from '../../combine/bindContextMenu'

// Make a group of buttons that is headed by the separator.
function template(context) {
  const { buttonGroup } = context
  return `
<div class="textae-control ${
    isTouchDevice() ? 'textae-android-context-menu' : 'textae-context-menu'
  }">
  ${buttonGroup
    .map(({ list }) => list.map(toMenuItem()).join(''))
    .join('<p class="textae-control-separator"></p>\n')}
</div>
`
}

export default class ContextMenu extends Control {
  constructor(editor) {
    super(editor, template(buttonConfig.contextMenu))

    editor.eventEmitter
      .on('textae-event.control.button.push', (data) =>
        this.updateButtonPushState(data.buttonName, data.state)
      )
      .on('textae-event.control.buttons.change', (enableButtons) =>
        this.updateAllButtonEnableState(enableButtons)
      )
      .on('textae-event.editor.key.input', () => this.hide())

    bindContextMenu(editor, this)
  }

  show(positionTop, positionLeft) {
    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')
  }

  showAbove(positionTop, positionLeft) {
    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')

    const { height } = this.el.getBoundingClientRect()
    super.el.setAttribute(
      'style',
      `top: ${positionTop - height}px; left: ${positionLeft}px`
    )
  }

  hide() {
    if (this._isOpen) {
      super.el.classList.remove('textae-context-menu--show')
      super.el.classList.add('textae-context-menu--hide')
    }
  }

  get _isOpen() {
    return super.el.classList.contains('textae-context-menu--show')
  }
}
