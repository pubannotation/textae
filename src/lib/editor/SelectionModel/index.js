import SelectedElements from './SelectedElements'

export default class SelectionModel {
  constructor(eventEmitter, annotationData) {
    this._annotationData = annotationData

    this.span = new SelectedElements(eventEmitter, 'span', annotationData)
    this.entity = new SelectedElements(eventEmitter, 'entity', annotationData)
    this.relation = new SelectedElements(
      eventEmitter,
      'relation',
      annotationData
    )

    // extend Entity container
    this.entity.isSamePredAttrributeSelected = (pred) =>
      this.entity.all.some((entity) =>
        entity.attributes.find((attribute) => attribute.pred === pred)
      )

    this.entity.findSelectedWithSamePredicateAttribute = (attrDef) => {
      return this.entity.all.find((entity) =>
        entity.attributes.find((attribute) => attribute.pred === attrDef.pred)
      )
    }

    // Bind the selection model to the model.
    eventEmitter
      .on('textae.annotationData.span.remove', (span) =>
        this.span.removeInstance(span)
      )
      .on('textae.annotationData.entity.remove', (entity) =>
        this.entity.removeInstance(entity)
      )
      .on('textae.annotationData.relation.remove', (relation) =>
        this.relation.removeInstance(relation)
      )
      .on('textae.annotationData.all.change', () => {
        this.span.clear()
        this.entity.clear()
        this.relation.clear()
      })
  }

  add(modelType, id) {
    console.assert(this[modelType])
    this[modelType].add(id)
  }

  clear() {
    this.span.removeAll()
    this.entity.removeAll()
    this.relation.removeAll()
  }

  selectEntity(id, isMulti) {
    if (isMulti) {
      this.entity.toggle(id)
    } else {
      this.clear()
      this.entity.add(id)
    }
  }

  selectRelation(id, isMulti) {
    if (!isMulti) {
      this.clear()
    }

    this.relation.add(id)
  }

  addSpan(spanId) {
    this.span.add(spanId)
  }

  toggleSpan(spanId) {
    this.span.toggle(spanId)
  }

  selectEntityById(entityId) {
    this.entity.add(entityId)
  }

  selectSpanEx(id) {
    this.clear()
    this.span.add(id)
  }

  selectSpanRange(rangeOfSpans) {
    // select reange of spans.
    this.clear()
    for (const id of rangeOfSpans) {
      this.span.add(id)
    }
  }
}
