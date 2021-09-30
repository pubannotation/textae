import delegate from 'delegate'
import dohtml from 'dohtml'
import template from './template'
import Pallet from '../Pallet'

export default class SelectionAttributePallet extends Pallet {
  constructor(editorHTMLElement) {
    super(editorHTMLElement, 'Selection attribute')

    this._veil = dohtml.create(
      `<div style="position: fixed; right: 0; top: 0; bottom:0; left: 0; background-color: rgba(0, 0, 10, 0.3);"></div>`
    )
  }

  show(attrDef, zIndex = 90, opener = null) {
    this._editorHTMLElement.appendChild(this._veil)
    this._editorHTMLElement.appendChild(this.el)
    this._veil.style['z-index'] = zIndex + 1
    this._el.style['z-index'] = zIndex + 1
    this._attributeDefinition = attrDef
    super.show()

    // Close the SelectionAttributePallet with the Esc key.
    this._opener = opener
    this._el.querySelector('.textae-editor__type-pallet__close-button').focus()
    this._el.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        event.preventDefault()
        this.hide()
      }
    })

    this._show = true

    return new Promise((resolve) => {
      delegate(
        this._el,
        '.textae-editor__type-pallet__selection-attribute-label',
        'click',
        (e) => {
          this.hide()
          resolve(e.target.dataset.id)
        }
      )
    })
  }

  hide() {
    if (this._show) {
      this._editorHTMLElement.removeChild(this._veil)
      this._editorHTMLElement.removeChild(this.el)

      this._show = false
    }

    // Focus on the button used to open the palette
    // so that the Entity Edit dialog can be closed with the Esc key.
    if (this._opner) {
      this._opener.focus()
    }
  }

  get _content() {
    const values = {
      attrDef: this._attributeDefinition.JSON
    }
    return template(values)
  }
}
