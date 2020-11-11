import SELECTED from '../../SELECTED'

export default class {
  select(entity) {
    const el = entity.element
    el.classList.add(SELECTED)

    // Set focus to the label element in order to scroll the browser to the position of the element.
    el.querySelector('.textae-editor__entity__type-label').focus()
  }

  deselect(entity) {
    entity.element.classList.remove(SELECTED)
  }
}
