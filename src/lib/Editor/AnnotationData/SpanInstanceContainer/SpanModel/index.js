import dohtml from 'dohtml'
import createGridHtml from './createGridHtml'
import updateGridPosition from './updateGridPosition'
import getAnnotationBox from '../../getAnnotationBox'
import getRightGrid from './getRightGrid'
import createRangeToSpan from '../createRangeToSpan'
import round from '../../../round'

export default class SpanModel {
  constructor(editorID, editorHTMLElement, begin, end, spanModelContainer) {
    this._editorID = editorID
    this._editorHTMLElement = editorHTMLElement
    this._begin = begin
    this._end = end
    this._spanModelContainer = spanModelContainer
    this._isGridRendered = false
    this._isSelected = false
    /**
     * @type {Set<import('../../../EntityModel').default>}
     */
    this._entities = new Set()

    this.severTies()
  }

  get begin() {
    return this._begin
  }

  get end() {
    return this._end
  }

  get title() {
    return `${this._begin}-${this._end}`
  }

  get types() {
    return []
  }

  /**
   * @return {[import('../../../EntityModel').default]}
   */
  get entities() {
    return [...this._entities]
  }

  get relations() {
    return this.entities.map(({ relations }) => relations).flat()
  }

  get bigBrother() {
    // The parent of a big Brother and the span is the same.
    const bros = this.parent.children
    const index = bros.indexOf(this)
    return index === 0 ? null : bros[index - 1]
  }

  get root() {
    return this._spanModelContainer
  }

  get parent() {
    return this._parent
  }

  get children() {
    return this._children
  }

  /**
   *
   * @param {import('../../../EntityModel').default} entity
   */
  add(entity) {
    this._entities.add(entity)
  }

  /**
   *
   * @param {import('../../../EntityModel').default} entity
   */
  remove(entity) {
    this._entities.delete(entity)
  }

  severTies() {
    // Reset parent
    this._parent = null
    // Reset children
    this._children = []
  }

  beChildOf(parent) {
    parent.children.push(this)
    this._parent = parent
  }

  traverse(preOrderFunction) {
    preOrderFunction(this)

    for (const child of this._children) {
      child.traverse(preOrderFunction)
    }
  }

  get element() {
    return document.querySelector(`#${this.id}`)
  }

  render() {
    // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
    this.traverse((span) => {
      if (span.element !== null) {
        span.destroyElement()
      }
    })

    // Reflow occurs when acquiring the position information of the span to draw the grid.
    // If the span drawing and grid drawing are repeated at the first display,
    // the reflow effect will slow down the process.
    // Here, only the span will be drawn,
    // and the grid drawing will be done at another time.
    this.traverse((span) => span.renderElement())
  }

  erase() {
    if (this.hasStyle) {
      const spanElement = this.element
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      this.destroyElement()
    }
    this._destroyGridElement()
  }

  renderElement() {
    const element = dohtml.create(this._contentHTML)
    const targetRange = createRangeToSpan(this)
    targetRange.surroundContents(element)
  }

  destroyElement() {
    const spanElement = this.element
    const parent = spanElement.parentNode

    // Move the textNode wrapped this span in front of this span.
    while (spanElement.firstChild) {
      parent.insertBefore(spanElement.firstChild, spanElement)
    }

    parent.removeChild(spanElement)
    parent.normalize()
  }

  get gridElement() {
    return document.querySelector(`#G${this.id}`)
  }

  get gridHeight() {
    return this.entities
      .map(({ heightWithTypeGap }) => heightWithTypeGap)
      .reduce((sum, entityHeight) => sum + entityHeight, 0)
  }

  get isGridRendered() {
    return this._isGridRendered
  }

  get isSelected() {
    return this._selected
  }

  select() {
    this._selected = true
  }

  deselect() {
    this._selected = false
  }

  focus() {
    // Grids outside the rendering area may not be rendered.
    this.forceRenderGrid()
    this.element.focus()
  }

  addEntityElementToGridElement(entityElement) {
    this.gridElement.insertAdjacentElement('beforeend', entityElement)
  }

  updateSelfAndAncestorsGridPosition() {
    // Do nothing.
    // This method overrided in the DenotationSpanModel.
  }

  drawGrid(clientHeight, clientWidth) {
    if (this.isGridInDrawArea(clientHeight, clientWidth)) {
      this.forceRenderGrid()
    } else {
      this._destroyGridElement()
    }
  }

  forceRenderGrid() {
    if (this._isGridRendered) {
      return
    }

    this._renderGridElement()
    for (const entity of this.entities) {
      entity.render()
    }
  }

  isGridInDrawArea() {
    throw new Error(
      'SpanModel.isGridInDrawArea should be implemented in a subclass.'
    )
  }

  _renderGridElement() {
    if (this.isGridRendered) {
      return this.gridElement
    }

    const rightGrid = getRightGrid(this._editorHTMLElement, this.id)
    if (rightGrid) {
      // insert before the right grid.
      rightGrid.insertAdjacentElement('beforebegin', this._createGridElement())
      this._isGridRendered = true

      return rightGrid.previousElementSibling
    } else {
      // append to the annotation area.
      const container = getAnnotationBox(this._editorHTMLElement)
      container.insertAdjacentElement('beforeend', this._createGridElement())
      this._isGridRendered = true

      return container.lastElementChild
    }
  }

  _createGridElement() {
    const { offsetTopOfGrid, offsetLeftOfGrid, widthOfGrid } = this
    const html = createGridHtml(
      this.id,
      round(offsetTopOfGrid),
      round(offsetLeftOfGrid),
      widthOfGrid
    )
    return dohtml.create(html)
  }

  updateGridPosition() {
    if (this.isGridRendered) {
      const { offsetTopOfGrid, offsetLeftOfGrid } = this
      updateGridPosition(
        this.gridElement,
        round(offsetTopOfGrid),
        round(offsetLeftOfGrid)
      )
    }
  }

  _destroyGridElement() {
    if (this.isGridRendered) {
      this._isGridRendered = false

      for (const entity of this.entities) {
        entity.erase()
      }

      this.gridElement.remove()
    }
  }

  get _styleClasses() {
    return [...this.styles.values()].map(
      (style) => `textae-editor__style textae-editor__style--${style}`
    )
  }

  /**
   *
   * @param {import('../../../InternalAPI/Presenter/EditMode/SelectionWrapper').default} selectionWrapper
   */
  getShortenInAnchorNodeToFocusNodeDirection(
    spanAdjuster,
    selectionWrapper,
    sourceDoc,
    spanConfig
  ) {
    const { anchor, focus } = selectionWrapper.positionsOnAnnotation

    if (anchor < focus) {
      // shorten the left boundary
      return {
        begin: spanAdjuster.forwardFromBegin(sourceDoc, focus, spanConfig),
        end: this.end
      }
    } else {
      // shorten the right boundary
      return {
        begin: this.begin,
        end: spanAdjuster.backFromEnd(sourceDoc, focus - 1, spanConfig) + 1
      }
    }
  }

  getShortenInFocusNodeToAnchorNodeDirection(
    spanAdjuster,
    selectionWrapper,
    sourceDoc,
    spanConfig
  ) {
    const { anchor, focus } = selectionWrapper.positionsOnAnnotation

    if (focus < anchor) {
      // shorten the left boundary
      return {
        begin: spanAdjuster.forwardFromBegin(sourceDoc, anchor, spanConfig),
        end: this.end
      }
    } else {
      // shorten the right boundary
      return {
        begin: this.begin,
        end: spanAdjuster.backFromEnd(sourceDoc, anchor - 1, spanConfig) + 1
      }
    }
  }

  getExpandedInAnchorNodeToFocusNodeDirection(
    spanAdjuster,
    selectionWrapper,
    sourceDoc,
    spanConfig
  ) {
    const { anchor, focus } = selectionWrapper.positionsOnAnnotation

    if (anchor < focus) {
      // expand to the right
      return {
        begin: this.begin,
        end: spanAdjuster.forwardFromEnd(sourceDoc, focus - 1, spanConfig) + 1
      }
    } else {
      // expand to the left
      return {
        begin: spanAdjuster.backFromBegin(sourceDoc, focus, spanConfig),
        end: this.end
      }
    }
  }

  getExpandedInFocusNodeToAnchorNodeDirection(
    spanAdjuster,
    selectionWrapper,
    sourceDoc,
    spanConfig
  ) {
    const { anchor, focus } = selectionWrapper.positionsOnAnnotation

    if (focus < anchor) {
      // expand to the right
      return {
        begin: this.begin,
        end: spanAdjuster.forwardFromEnd(sourceDoc, anchor - 1, spanConfig) + 1
      }
    } else {
      // expand to the left
      return {
        begin: spanAdjuster.backFromBegin(sourceDoc, anchor, spanConfig),
        end: this.end
      }
    }
  }
}
