import dohtml from 'dohtml'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'
import createGridHtml from './createGridHtml'
import getBigBrotherSpan from './getBigBrotherSpan'
import updateGridPosition from './updateGridPosition'
import getAnnotationBox from '../../getAnnotationBox'
import getRightGrid from './getRightGrid'
import createRangeToSpan from '../createRangeToSpan'

export default class SpanModel {
  constructor(editorID, editorHTMLElement, begin, end, spanModelContainer) {
    this._editorID = editorID
    this._editorHTMLElement = editorHTMLElement
    this._begin = begin
    this._end = end
    this._spanModelContainer = spanModelContainer
    this._isGridRendered = false

    this.severTies()
  }

  get id() {
    return makeDenotationSpanHTMLElementID(
      this._editorID,
      this._begin,
      this._end
    )
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
    if (this._entityModelContainer) {
      return this._entityModelContainer.getAllOfSpan(this)
    }

    return []
  }

  get bigBrother() {
    return getBigBrotherSpan(this, this._spanModelContainer.topLevel)
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

  traverse(preOrderFunction, postOrderFunction) {
    preOrderFunction(this)

    for (const child of this._children) {
      child.traverse(preOrderFunction, postOrderFunction)
    }

    if (postOrderFunction) {
      postOrderFunction(this)
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

    this.traverse(
      (span) => span.renderElement(),
      (span) => {
        // When the child spans contain bold style spans, the width of the parent span changes.
        // Render the entity after the child span has been rendered.
        span.drawGridInSight()
      }
    )
  }

  erase() {
    if (this.hasStyle) {
      const spanElement = this.element
      spanElement.removeAttribute('tabindex')
      spanElement.classList.remove('textae-editor__span')
    } else {
      this.destroyElement()
    }
    this.destroyGridElement()
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
    const typeGapHeight = this._spanModelContainer.typeGap.height
    const { entities } = this
    return entities
      .map(({ height }) => height)
      .reduce((sum, entityHeight) => sum + typeGapHeight + entityHeight, 0)
  }

  get isGridRendered() {
    return this._isGridRendered
  }

  renderGridElement() {
    if (this.isGridRendered) {
      return this.gridElement
    }

    if (!this.isGridInViewport) {
      return
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

  addEntityElementToGridElement(entityElement) {
    this.gridElement.insertAdjacentElement('beforeend', entityElement)
  }

  updateSelfAndAncestorsGridPosition() {
    // Do nothing.
    // This method overrided in the DenotationSpanModel.
  }

  drawGridInSight() {
    if (this.isDenotation || this.isBlock) {
      if (this.isGridInViewport) {
        this.renderGridElement()
        for (const entity of this.entities) {
          entity.render()
        }
      }
    }
  }

  get isGridInViewport() {
    return true
  }

  _createGridElement() {
    const { width, top, left } = this.gridRectangle
    const html = createGridHtml(this.id, top, left, width)
    return dohtml.create(html)
  }

  updateGridPosition() {
    if (this.isGridRendered) {
      const { top, left } = this.gridRectangle
      updateGridPosition(this.gridElement, top, left)
    }
  }

  destroyGridElement() {
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

  getShotrenInAnchorNodeToFocusNodeDirection(
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
