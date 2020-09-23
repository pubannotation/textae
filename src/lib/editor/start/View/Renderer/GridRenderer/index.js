import getAnnotationBox from '../getAnnotationBox'
import createGrid from './createGrid'
import adaptWidthToSpan from './adaptWidthToSpan'
import getGridElement from './getGridElement'

export default class {
  constructor(editor, domPositionCache) {
    this.editor = editor
    this.domPositionCache = domPositionCache
    this.container = getAnnotationBox(editor)
  }

  render(span) {
    return createGrid(
      this.editor[0],
      this.domPositionCache,
      this.container[0],
      span.id
    )
  }

  remove(span) {
    const gridElement = getGridElement(span.id)

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }

    this.domPositionCache.removeGrid(span.id)
  }

  updateWidth(span) {
    const gridElement = getGridElement(span.id)
    adaptWidthToSpan(gridElement, this.domPositionCache, span.id)
  }
}
