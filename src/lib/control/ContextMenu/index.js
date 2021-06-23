import Control from '../Control'
import isTouchDevice from '../isTouchDevice'
import buttonConfig from '../../buttonConfig'
import toMenuItem from './toMenuGroup/toMenuItem'

// Make a group of buttons that is headed by the separator.
function template(context) {
  const { buttonGroup } = context
  return `
<div class="textae-control ${
    isTouchDevice() ? 'textae-android-context-menu' : 'textae-context-menu'
  }">
  ${buttonGroup
    .map(
      ({ list }) => `
        <p class="textae-control__separator"></p>
        ${list.map(toMenuItem()).join('\n')}
      `
    )
    .join('\n')}
</div>
`
}

export default class ContextMenu extends Control {
  constructor(editor) {
    super(editor, template(buttonConfig.contextMenu))
  }

  show(positionTop, positionLeft) {
    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')
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
