import getEntityDom from '../getEntityDom'
import getLabelDomOfType from '../getLabelDomOfType'
import SELECTED from './SELECTED'
import applyEntityTypeValues from './applyEntityTypeValues'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  select(id) {
    const el = getEntityDom(this._editor, id)

    // Entities of block span hos no dom elements.
    if (el) {
      el.classList.add(SELECTED)

      // Set focus to the label element in order to scroll the browser to the position of the element.
      getLabelDomOfType(el).focus()
    }
  }

  deselect(id) {
    const el = getEntityDom(this._editor, id)

    // Entities of block span hos no dom elements.
    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }
  }

  updateLabel(id) {
    const el = getEntityDom(this._editor, id)

    if (el) {
      applyEntityTypeValues(el, SELECTED)
    }
  }
}
