import getEntityDom from '../../getEntityDom'
import getTypeDomOfEntityDom from '../../getTypeDomOfEntityDom'
import getTypeValuesDom from '../getTypeValuesDom'
import SELECTED from '../SELECTED'
import getLabelDomOfType from './getLabelDomOfType'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  select(id) {
    const el = getEntityDom(this._editor, id)
    const type = getTypeDomOfEntityDom(el)
    const typeValues = getTypeValuesDom(el)

    el.classList.add(SELECTED)
    type.classList.add(SELECTED)
    typeValues.classList.add(SELECTED)

    // Set focus to the label element in order to scroll the browser to the position of the element.
    getLabelDomOfType(el).focus()
  }

  deselect(id) {
    const el = getEntityDom(this._editor, id)
    const type = getTypeDomOfEntityDom(el)
    const typeValues = getTypeValuesDom(el)

    el.classList.remove(SELECTED)
    type.classList.remove(SELECTED)
    typeValues.classList.remove(SELECTED)
  }
}
