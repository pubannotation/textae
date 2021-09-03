import dohtml from 'dohtml'
import Control from '../Control'
import isTouchDevice from '../../isTouchDevice'
import buttonConfig from '../../buttonConfig'
import bindToWindowEvents from './bindToWindowEvents'

// Make a group of buttons that is headed by the separator.
function template(context) {
  return `
<div class="textae-control ${
    isTouchDevice() ? 'textae-android-context-menu' : 'textae-context-menu'
  }">
  ${context
    .map((list) =>
      list
        .map(
          ({ type, title, classList }) =>
            `<p 
              class="${classList.join(' ')}"  
              data-button-type="${type}">${title}
            </p>`
        )
        .join('')
    )
    .join('<p class="textae-control-separator"></p>\n')}
</div>
`
}

export default class ContextMenu extends Control {
  constructor(editor) {
    super(editor, template([]))

    this._enableButtons = new Map()
    this._pushButtons = {}
    this._transitButtons = {}

    editor.eventEmitter
      .on(
        'textae-event.control.button.push',
        (data) => (this._pushButtons[data.buttonName] = data.state)
      )
      .on(
        'textae-event.control.buttons.change',
        (enableButtons) => (this._enableButtons = enableButtons)
      )
      .on('textae-event.control.writeButton.transit', (isTransit) => {
        this._transitButtons['write'] = isTransit
      })

      .on('textae-event.editor.key.input', () => this.hide())

    bindToWindowEvents(editor, this)

    this._editor = editor
  }

  showLowerRight(positionTop, positionLeft) {
    this._show()

    super.el.setAttribute(
      'style',
      `top: ${positionTop}px; left: ${positionLeft}px`
    )
  }

  showAbove(positionTop, positionLeft) {
    this._show()

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

  _show() {
    const context = buttonConfig.contextMenu.buttonGroup.map(({ list }) => {
      const ret = []
      for (const { type, title } of list) {
        const classList = [
          'textae-control-icon',
          `textae-control-${type}-button`
        ]
        if (this._pushButtons[type]) {
          classList.push('textae-control-icon--pushed')
        }
        if (!this._enableButtons.get(type)) {
          classList.push('textae-control-icon--disabled')
        }
        if (this._transitButtons[type]) {
          classList.push('textae-control-icon--transit')
        }

        ret.push({ type, title, classList })
      }

      return ret
    })

    super.el.replaceChildren(...dohtml.create(template(context)).children)

    super.el.classList.remove('textae-context-menu--hide')
    super.el.classList.add('textae-context-menu--show')
  }
}
