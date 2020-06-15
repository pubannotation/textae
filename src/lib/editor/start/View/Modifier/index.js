import getDomPositionCache from '../getDomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'
import getEntityDom from '../../getEntityDom'
import getLabelDomOfType from '../../getLabelDomOfType'
import updateEntityTypeValues from './updateEntityTypeValues'
import getSpanDom from './getSpanDom'
import modifyStyle from './modifyStyle'

export default class {
  constructor(editor, annotationData) {
    this._editor = editor
    this._domPositionCache = getDomPositionCache(editor, annotationData.entity)
  }

  get span() {
    return {
      select: (id) => {
        const el = getSpanDom(id)
        modifyStyle(el, 'add')

        // Set focus to the span element in order to scroll the browser to the position of the element.
        el.focus()
      },
      deselect: (id) => {
        const el = getSpanDom(id)

        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove')
        }
      }
    }
  }

  get entity() {
    return {
      select: (id) => {
        const el = getEntityDom(this._editor[0], id)

        // Entities of block span hos no dom elements.
        if (el) {
          modifyStyle(el, 'add')

          // Set focus to the label element in order to scroll the browser to the position of the element.
          getLabelDomOfType(el).focus()
        }
      },
      deselect: (id) => {
        const el = getEntityDom(this._editor[0], id)

        // Entities of block span hos no dom elements.
        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove')
        }
      }
    }
  }

  get relation() {
    return {
      select: (id) => selectRelation(this._domPositionCache, id),
      deselect: (id) => deselectRelation(this._domPositionCache, id)
    }
  }

  get entityLabel() {
    return {
      update: (id) => updateEntityTypeValues(this._editor, id)
    }
  }
}
