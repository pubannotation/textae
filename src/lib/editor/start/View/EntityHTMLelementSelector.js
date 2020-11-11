import getEntityEndopoint from './getEntityEndopoint'
import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'
import SELECTED from '../../SELECTED'

export default class {
  constructor(editor) {
    this._editor = editor
  }

  select(id) {
    const el = getEntityEndopoint(this._editor, id)
    const entityHTMLElement = getEntityHTMLelementFromChild(el)
    entityHTMLElement.classList.add(SELECTED)

    // Set focus to the label element in order to scroll the browser to the position of the element.
    entityHTMLElement
      .querySelector('.textae-editor__entity__type-label')
      .focus()
  }

  deselect(id) {
    const el = getEntityEndopoint(this._editor, id)
    const entityHTMLElement = getEntityHTMLelementFromChild(el)
    entityHTMLElement.classList.remove(SELECTED)
  }
}
