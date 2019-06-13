import getRightGrid from "./getRightGrid"

export default function(editorDom, domPositionCache, container, spanId) {
  const spanPosition = domPositionCache.getSpan(spanId)
  const element = createGridElement(spanId, spanPosition.width)
  const rightGrid = getRightGrid(editorDom, spanId)
  if (rightGrid) {
    container.insertBefore(element, rightGrid)
  } else {
    // append to the annotation area.
    container.appendChild(element)
  }
  return element
}

function createGridElement(spanId, spanWidth) {
  const element = document.createElement('div')
  element.setAttribute('id', `G${spanId}`)
  element.classList.add('textae-editor__grid')
  element.classList.add('hidden')
  element.style.width = `${spanWidth}px`
  return element
}

