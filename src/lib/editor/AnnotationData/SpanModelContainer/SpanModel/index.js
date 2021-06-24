import dohtml from 'dohtml'
import { makeDenotationSpanHTMLElementId } from '../../../idFactory'
import createGridHtml from './createGridHtml'
import getBigBrotherSpan from './getBigBrotherSpan'
import updateGridPosition from './updateGridPosition'
import getAnnotationBox from '../../getAnnotationBox'
import getRightGrid from './getRightGrid'
import createRangeToSpan from '../createRangeToSpan'

export default class SpanModel {
  constructor(editor, begin, end, spanModelContainer) {
    this._editor = editor
    this._begin = begin
    this._end = end
    this._spanModelContainer = spanModelContainer

    this.severTies()
  }

  get id() {
    return makeDenotationSpanHTMLElementId(this._editor, this._begin, this._end)
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

  get entities() {
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
        for (const entity of span.entities) {
          entity.render()
        }
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

  get isGridRendered() {
    return this.gridElement
  }

  renderGridElement() {
    const rightGrid = getRightGrid(this._editor, this.id)
    if (rightGrid) {
      // insert before the right grid.
      rightGrid.insertAdjacentElement('beforebegin', this._createGridElement())
      return rightGrid.previousElementSibling
    } else {
      // append to the annotation area.
      const container = getAnnotationBox(this._editor)
      container.insertAdjacentElement('beforeend', this._createGridElement())
      return container.lastElementChild
    }
  }

  _createGridElement() {
    const { width, top, left } = this._gridRectangle
    const html = createGridHtml(this.id, top, left, width)
    return dohtml.create(html)
  }

  updateGridPosition() {
    const { top, left } = this._gridRectangle
    updateGridPosition(this.gridElement, top, left)
  }

  destroyGridElement() {
    if (this.isGridRendered) {
      this.gridElement.remove()
    }
  }

  get _styleClasses() {
    return [...this.styles.values()].map(
      (style) => `textae-editor__style textae-editor__style--${style}`
    )
  }

  getShortenSpan(spanAdjuster, selectionWrapper, sourceDoc, spanConfig) {
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

  getExpandedSpanFromAnchorNode(
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
}
