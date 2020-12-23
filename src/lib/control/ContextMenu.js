import compileHandlebarsTemplate from '../compileHandlebarsTemplate'
import Control from './Control'

// Make a group of buttons that is headed by the separator.
const htmlTemplate = `
<div class="textae-control textae-context-menu">
  <p class="textae-control__title">
    <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
  </p>
  {{#buttonGroup}}
  <p class="textae-control__separator"></p>
    {{#list}}
  <p class="textae-control__icon textae-control__{{type}}-button" data-button-type="{{type}}">{{title}}</p>
    {{/list}}
  {{/buttonGroup}}
</div>
`

export default class ContextMenu extends Control {
  constructor(editor) {
    const template = compileHandlebarsTemplate(htmlTemplate)
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
