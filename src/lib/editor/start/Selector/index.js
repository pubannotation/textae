import idFactory from '../../idFactory'
import DomPositionCache from '../View/DomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'
import getEntityDom from '../getEntityDom'

const SELECTED = 'ui-selected'

export default function(editor, annotationData) {
  let domPositionCache = new DomPositionCache(editor, annotationData.entity)

  return {
    span: {
      select: (id) => {
        let el = getSpanDom(id)
        modifyStyle(el, 'add')

        // Set focus to the span element in order to scroll the browser to the position of the element.
        el.focus()
      },
      deselect: (id) => {
        let el = getSpanDom(id)

        // A dom does not exist when it is deleted.
        if (el) {
          modifyStyle(el, 'remove')
        }
      }
    },
    entity: {
      select: (id) => {
        let el = getEntityDom(editor[0], id)

        // Entities of block span hos no dom elements.
        if (el) {
          modifyStyle(el, 'add')

          // Set focus to the label element in order to scroll the browser to the position of the element.
          el.parentNode.nextElementSibling.focus()
        }
      },
      deselect: (id) => {
        let el = getEntityDom(editor[0], id)

        // Entities of block span hos no dom elements.
        // A dom does not exist when it is deleted.
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
  let entity = getEntityDom(editor[0], entityId)

  // Entities of block span hos no dom elements.
  if (entity) {
    let typePane = entity.parentNode,
      typeLabel = typePane.nextElementSibling

    if (typePane.children.length === typePane.querySelectorAll(`.${SELECTED}`).length) {
      typeLabel.classList.add(SELECTED)
      typePane.classList.add(SELECTED)
    } else {
      typeLabel.classList.remove(SELECTED)
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
