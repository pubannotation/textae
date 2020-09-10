import mappingFunction from './mappingFunction'
import createSpanTree from './createSpanTree'
import spanComparator from './spanComparator'
import idFactory from '../../idFactory'
import ObjectSpanModel from './ObjectSpanModel'
import StyleSpanModel from './StyleSpanModel'
import ContainerWithSubContainer from '../ContainerWithSubContainer'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import isAlreadySpaned from './isAlreadySpaned'

export default class extends ContainerWithSubContainer {
  constructor(editor, emitter, parentContainer) {
    super(emitter, parentContainer, 'span', (denotations) =>
      mappingFunction(denotations, editor, this.entityContainer, this)
    )
    this._editor = editor

    // Keep tyep sets independent of span editing.
    this._typeSets = new Map()
  }

  _addToContainer(instance) {
    if (instance instanceof ObjectSpanModel) {
      this._container.set(instance.id, instance)
    }

    if (instance instanceof StyleSpanModel) {
      if (this._typeSets.has(instance.id)) {
        this._typeSets.get(instance.id).appendStyles(instance.styles)
      } else {
        this._typeSets.set(instance.id, instance)
      }
    }

    return instance
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(span) {
    console.assert(span, 'span is necessary.')

    return super.add(
      new ObjectSpanModel(this._editor, span, this.entityContainer, this),
      () => {
        createSpanTree(this.all)
      }
    )
  }

  addSource(spans) {
    super.addSource(spans)
    createSpanTree(this.all)
  }

  has(span) {
    const spanId = idFactory.makeSpanDomId(this._editor, span)
    return this._container.has(spanId)
  }

  get(spanId) {
    if (this._container.has(spanId)) {
      const span = super.get(spanId)

      // Merges a span and a typeset so that it can be rendered as a single DOM element.
      if (this._typeSets.has(spanId)) {
        span.styles = this._typeSets.get(spanId).styles
      }
      return span
    } else {
      // Returns a typeset only.
      return this._typeSets.get(spanId)
    }
  }

  range(firstId, secondId) {
    let first = super.get(firstId)
    let second = super.get(secondId)

    // switch if seconfId before firstId
    if (spanComparator(first, second) > 0) {
      const temp = first
      first = second
      second = temp
    }

    return super.all
      .filter((span) => first.begin <= span.begin && span.end <= second.end)
      .map((span) => span.id)
  }

  get topLevel() {
    return this.all.filter((span) => span.parent === null).sort(spanComparator)
  }

  remove(id) {
    const span = super.remove(id)
    createSpanTree(this.all)
    return span
  }

  clear() {
    super.clear()
    this._typeSets = new Map()
  }

  move(id, newSpan) {
    const oldOne = super.remove(id)
    const newOne = super.add(
      new ObjectSpanModel(this._editor, newSpan, this.entityContainer, this),
      (newOne) => {
        createSpanTree(this.all)
        // Span.entities depends on the property of the entity.
        // Span DOM element is rendered by 'span.add' event.
        // We need to update the span ID of the entity before 'span.add' event.
        oldOne.passesAllEntitiesTo(newOne)
      }
    )

    super._emit('textae.annotationData.span.move')

    return [
      {
        begin: oldOne.begin,
        end: oldOne.end
      },
      newOne.id
    ]
  }

  isBoundaryCrossingWithOtherSpans(span) {
    return isBoundaryCrossingWithOtherSpans(this.all, span)
  }

  isAlreadySpaned(span) {
    return isAlreadySpaned(this.all, span)
  }

  get all() {
    const styleOnlySpans = [...this._typeSets.values()].filter(
      (s) => !this._container.has(s.id)
    )
    return super.all.concat(styleOnlySpans)
  }

  get allSpansWithGrid() {
    return super.all
  }
}
