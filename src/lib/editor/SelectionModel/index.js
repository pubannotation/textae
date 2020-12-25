import IDContainer from './IDContainer'

const kinds = ['span', 'entity', 'relation']

export default class SelectionModel {
  constructor(eventEmitter, annotationData) {
    this._annotationData = annotationData

    this.span = new IDContainer(eventEmitter, 'span', annotationData)
    this.entity = new IDContainer(eventEmitter, 'entity', annotationData)
    this.relation = new IDContainer(eventEmitter, 'relation', annotationData)

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

    // When the annotation is loaded and the mode is determined,
    // the selection state is cleared via TypeEditor.cancelSelect.
    // No need to monitor `textae.annotationData.all.change` events.
    const eventMap = new Map([
      [
        'textae.annotationData.span.remove',
        (span) => this.span.removeInstance(span)
      ],
      [
        'textae.annotationData.entity.remove',
        (entity) => this.entity.removeInstance(entity)
      ],
      [
        'textae.annotationData.relation.remove',
        (relation) => this.relation.removeInstance(relation)
      ]
    ])

    // Bind the selection model to the model.
    for (const eventHandler of eventMap) {
      eventEmitter.on(eventHandler[0], eventHandler[1])
    }
  }

  add(modelType, id) {
    console.assert(this[modelType])
    this[modelType].add(id)
  }

  clear() {
    this.span.clear()
    this.entity.clear()
    this.relation.clear()
  }

  selectSpan(id, isMulti) {
    if (!isMulti) {
      this.clear()
    }
    this.span.add(id)
  }

  selectEntity(id, isMulti) {
    if (!isMulti) {
      this.clear()
    }

    this.entity.add(id)
  }

  selectRelation(id, isMulti) {
    if (!isMulti) {
      this.clear()
    }

    this.relation.add(id)
  }

  selectSpanById(spanId) {
    this.span.add(spanId)
  }

  toggleSpanById(spanId) {
    this.span.toggle(spanId)
  }

  selectEntityById(entityId) {
    this.entity.add(entityId)
  }
}
