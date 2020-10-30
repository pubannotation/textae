import SELECTED from '../SELECTED'

export default class {
  select(span) {
    const el = span.element
    el.classList.add(SELECTED)

    if (span.backgroundElement) {
      span.backgroundElement.classList.add(SELECTED)
    }

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect(span) {
    const el = span.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }

    if (span.backgroundElement) {
      span.backgroundElement.classList.remove(SELECTED)
    }
  }
}
