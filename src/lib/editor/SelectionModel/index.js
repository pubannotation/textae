import SelectedElementsWithAttributes from './SelectedElementsWithAttributes'
import SelectedElements from './SelectedElements'

export default class SelectionModel {
  constructor(eventEmitter, annotationData) {
    this._annotationData = annotationData

    this.span = new SelectedElements(eventEmitter, 'span', annotationData)
    this.entity = new SelectedElementsWithAttributes(
      eventEmitter,
      'entity',
      annotationData
    )
    this.relation = new SelectedElementsWithAttributes(
      eventEmitter,
      'relation',
      annotationData
    )

    // Bind the selection model to the model.
    eventEmitter
      .on('textae-event.annotation-data.span.remove', (span) =>
        this.span.removeInstance(span)
      )
      .on('textae-event.annotation-data.entity.remove', (entity) =>
        this.entity.removeInstance(entity)
      )
      .on('textae-event.annotation-data.relation.remove', (relation) =>
        this.relation.removeInstance(relation)
      )
      .on('textae-event.annotation-data.all.change', () => {
        // When the annotations are reset, the view will remove all HTML elements.
        // The selection model will release the selection instance without any manipulation.
        this.span.clear()
        this.entity.clear()
        this.relation.clear()
      })
  }

  add(modelType, id) {
    console.assert(this[modelType])
    this[modelType].add(id)
  }

  removeAll() {
    this.span.removeAll()
    this.entity.removeAll()
    this.relation.removeAll()
  }

  selectSpan(id) {
    this.removeAll()
    this.span.add(id)
  }

  selectSpanRange(rangeOfSpans) {
    this.removeAll()
    for (const id of rangeOfSpans) {
      this.span.add(id)
    }
  }

  selectEntity(id) {
    this.removeAll()
    this.entity.add(id)
  }

  selectRelation(id) {
    this.removeAll()
    this.relation.add(id)
  }
}
