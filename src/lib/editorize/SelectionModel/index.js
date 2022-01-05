import SelectedItemsWithAttributes from './SelectedItemsWithAttributes'
import SelectedItems from './SelectedItems'
import getSelectedEntities from './getSelectedEntities'

export default class SelectionModel {
  constructor(eventEmitter, annotationData) {
    this._annotationData = annotationData

    this.span = new SelectedItems(eventEmitter, 'span', annotationData)
    this.entity = new SelectedItemsWithAttributes(
      eventEmitter,
      'entity',
      annotationData
    )
    this.relation = new SelectedItemsWithAttributes(
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

  get copyingItems() {
    // Map entities to types, because entities may be delete.
    return [...getSelectedEntities(this)].map(({ typeValues }) => typeValues)
  }

  get cuttingItems() {
    return getSelectedEntities(this)
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
