import SELECTED from '../SELECTED'

export default class {
  select(id) {
    const el = document.querySelector(`#${id}`)
    el.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect(id) {
    const el = document.querySelector(`#${id}`)

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }
  }
}
