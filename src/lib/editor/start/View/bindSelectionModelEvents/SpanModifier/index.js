import getSpanDom from './getSpanDom'
import modifyStyle from '../../modifyStyle'

export default class {
  select(id) {
    const el = getSpanDom(id)
    modifyStyle(el, 'add')

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect(id) {
    const el = getSpanDom(id)

    // A dom does not exist when it is deleted.
    if (el) {
      modifyStyle(el, 'remove')
    }
  }
}
