import delegate from 'delegate'
import dohtml from 'dohtml'
import selectionAttributeTemplate from './selectionAttributeTemplate'
import Pallet from '../Pallet'

export default class SelectionAttributePallet extends Pallet {
  constructor(editor, done) {
    super(editor, 'entity', 'Please select value')

    this._veil = dohtml.create(
      `<div style="width: ${window.innerWidth}px; height: ${window.innerHeight}px; position: fixed; right: 0; top: 0; background-color: rgba(0, 0, 10, 0.3);"></div>`
    )

    delegate(
      this._el,
      '.textae-editor__type-pallet__selection-attribute-label',
      'click',
      (e) => {
        this.hide()
        done(e.target.dataset.id)
      }
    )
  }

  show(attrDef, zIndex) {
    this._editor[0].appendChild(this._veil)
    this._editor[0].appendChild(this.el)
    this._veil.style['z-index'] = zIndex + 1
    this._el.style['z-index'] = zIndex + 1
    this._attributeDefinition = attrDef
    super.show()
  }

  hide() {
    this._editor[0].removeChild(this._veil)
    this._editor[0].removeChild(this.el)
  }

  get _content() {
    const values = {
      attrDef: this._attributeDefinition.JSON
    }
    return selectionAttributeTemplate(values)
  }
}
