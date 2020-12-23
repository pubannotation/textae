import Control from './Control'

// Make a group of buttons that is headed by the separator.
function template(context) {
  const { buttonGroup } = context
  return `
<div class="textae-control textae-context-menu">
  <p class="textae-control__title">
    <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
  </p>
  ${buttonGroup.map(toMenuGroup()).join('\n')}
</div>
`
}

export default class ContextMenu extends Control {
  constructor(editor) {
    super(template, editor)
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

function toMenuGroup() {
  return ({ list }) => `
  <p class="textae-control__separator"></p>
  ${list.map(toMenuItem()).join('\n')}
  `
}

function toMenuItem() {
  return ({ type, title }) => `
  <p 
    class="textae-control__icon textae-control__${type}-button" 
    data-button-type="${type}">${title}
  </p>`
}
