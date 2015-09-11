import getAnnotationBox from './getAnnotationBox'
import {
  getRightElement
}
from '../../Presenter/handlers/SelectHandler/getElement'

export default function(editor, domPositionCache) {
  let container = getAnnotationBox(editor)

  return {
    render: (spanId) => createGrid(editor[0], domPositionCache, container[0], spanId),
    remove: (spanId) => {
      let grid = document.querySelector(`#G${spanId}`)
      if(grid)
        grid.parentNode.removeChild(grid)

      domPositionCache.gridPositionCache.delete(spanId)
    }
  }
}

function createGrid(editorDom, domPositionCache, container, spanId) {
  let spanPosition = domPositionCache.getSpan(spanId),
    element = document.createElement('div')

  element.setAttribute('id', `G${spanId}`)
  element.classList.add('textae-editor__grid')
  element.classList.add('hidden')
  element.style.width = spanPosition.width + 'px'

  let rightSpan = getRightElement(editorDom, document.querySelector(`#${spanId}`))
  if (rightSpan) {
    container.insertBefore(element, document.querySelector(`#G${rightSpan.id}`))
  } else {
    //append to the annotation area.
    container.appendChild(element);
  }

  return element
}
