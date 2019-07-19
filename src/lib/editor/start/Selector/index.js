import DomPositionCache from '../View/DomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'
import getEntityDom from '../getEntityDom'
import getLabelDomOfType from '../getLabelDomOfType'
import getEntitiesDomOfType from '../getEntitiesDomOfType'
import getPaneDomOfType from '../../getPaneDomOfType'

const SELECTED = 'ui-selected'

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
        const el = document.querySelector('div[title="' + id + '"]')

        if (el) {
          modifyStyle(el, 'add')
        }
      },
      deselect: (id) => {
        const el = document.querySelector('div[title="' + id + '"]')

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
      update: (id) => updateEntityLabel(editor, id)
    }
  }
}

// Select the typeLabel if all entities is selected.
function updateEntityLabel(editor, entityId) {
  console.assert(entityId, 'An entity id is necessary.')

  const entity = getEntityDom(editor[0], entityId)

  // Entities of block span hos no dom elements.
  if (entity) {
    const typePane = getPaneDomOfType(entity)
    const typeValues = typePane.closest('.textae-editor__type').querySelector('.textae-editor__type-values')
    const entities = getEntitiesDomOfType(entity)

    if (entities.length === typePane.querySelectorAll(`.${SELECTED}`).length) {
      typeValues.classList.add(SELECTED)
      typePane.classList.add(SELECTED)
    } else {
      typeValues.classList.remove(SELECTED)
      typePane.classList.remove(SELECTED)
    }
  }
}

function getSpanDom(id) {
  return document.querySelector(`#${id}`)
}

function modifyStyle(element, handle) {
  element.classList[handle](SELECTED)
}
