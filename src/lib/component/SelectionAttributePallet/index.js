import delegate from 'delegate'
import dohtml from 'dohtml'
import template from './template'
import Pallet from '../Pallet'

export default class SelectionAttributePallet extends Pallet {
  constructor(editor) {
    super(editor, 'entity', 'Please select value')

    this._veil = dohtml.create(
      `<div style="position: fixed; right: 0; top: 0; bottom:0; left: 0; background-color: rgba(0, 0, 10, 0.3);"></div>`
    )
  }

  show(attrDef, zIndex) {
    this._editor[0].appendChild(this._veil)
    this._editor[0].appendChild(this.el)
    this._veil.style['z-index'] = zIndex + 1
    this._el.style['z-index'] = zIndex + 1
    this._attributeDefinition = attrDef
    super.show()

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
    this._editor[0].removeChild(this._veil)
    this._editor[0].removeChild(this.el)
  }

  get _content() {
    const values = {
      attrDef: this._attributeDefinition.JSON
    }
    return template(values)
  }
}
