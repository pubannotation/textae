import getEntityEndopoint from '../getEntityEndopoint'
import getEntityHtmlelementFromChild from '../../getEntityHtmlelementFromChild'
import getTypeValues from '../getTypeValues'
import SELECTED from '../SELECTED'
import getLabelHtmlelementOfType from './getLabelHtmlelementOfType'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  select(id) {
    const el = getEntityEndopoint(this._editor, id)
    const type = getEntityHtmlelementFromChild(el)
    const typeValues = getTypeValues(el)

    el.classList.add(SELECTED)
    type.classList.add(SELECTED)
    typeValues.classList.add(SELECTED)

    // Set focus to the label element in order to scroll the browser to the position of the element.
    getLabelHtmlelementOfType(el).focus()
  }

  deselect(id) {
    const el = getEntityEndopoint(this._editor, id)
    const type = getEntityHtmlelementFromChild(el)
    const typeValues = getTypeValues(el)

    el.classList.remove(SELECTED)
    type.classList.remove(SELECTED)
    typeValues.classList.remove(SELECTED)
  }
}
