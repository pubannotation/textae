import DomPositionCache from '../View/DomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'
import getEntityDom from '../getEntityDom'
import getLabelDomOfType from '../getLabelDomOfType'
import updateEntityTypeValues from './updateEntityTypeValues'
import getSpanDom from './getSpanDom'
import modifyStyle from './modifyStyle'

export default function(editor, annotationData) {
  const domPositionCache = new DomPositionCache(editor, annotationData.entity)

  return {
    span: {
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
    },
    entity: {
      select: (id) => {
        const el = getEntityDom(editor[0], id)

        // Entities of block span hos no dom elements.
        if (el) {
          modifyStyle(el, 'add')

          // Set focus to the label element in order to scroll the browser to the position of the element.
          getLabelDomOfType(el).focus()
        }
      },
      deselect: (id) => {
        const el = getEntityDom(editor[0], id)

        // Entities of block span hos no dom elements.
        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove')
        }
      }
    },
    attribute: {
      select: (id) => {
        const el = document.querySelector(`div[title="${id}"]`)

        if (el) {
          modifyStyle(el, 'add')
        }
      },
      deselect: (id) => {
        const el = document.querySelector(`div[title="${id}"]`)

        if (el) {
          modifyStyle(el, 'remove')
        }
      }
    },
    relation: {
      select: (id) => selectRelation(domPositionCache, id),
      deselect: (id) => deselectRelation(domPositionCache, id)
    },
    entityLabel: {
      update: (id) => updateEntityTypeValues(editor, id)
    }
  }
}
