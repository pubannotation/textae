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

  render(spanId) {
    return createGrid(this.editor[0], this.domPositionCache, this.container[0], spanId)
  }

  remove(spanId) {
    const gridElement = getGridElement(spanId)

    if (gridElement) {
      gridElement.parentNode.removeChild(gridElement)
    }

    this.domPositionCache.gridPositionCache.delete(spanId)
  }

  changeId({oldId, newId}) {
    const gridElement = getGridElement(oldId)

    // Since block span has no grid, there may not be a grid.
    if (gridElement) {
      gridElement.setAttribute('id', `G${newId}`)

      for (const type of gridElement.querySelectorAll('.textae-editor__type, .textae-editor__entity-pane')) {
        type.setAttribute('id', type.getAttribute('id').replace(oldId, newId))
      }

      adaptWidthToSpan(gridElement, this.domPositionCache, newId)
    }

    this.domPositionCache.gridPositionCache.delete(oldId)
  }

  updateWidth(spanId) {
    const gridElement = getGridElement(spanId)

    // Since block span has no grid, there may not be a grid.
    if (gridElement) {
      adaptWidthToSpan(gridElement, this.domPositionCache, spanId)
    }
  }
}
