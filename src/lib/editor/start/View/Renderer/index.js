import EntityRenderer from './EntityRenderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class Renderer {
  constructor(editor, annotationData, selectionModel) {
    this._annotationData = annotationData
    const entityRenderer = new EntityRenderer(annotationData, selectionModel)
    this._relationRenderer = new RelationRenderer(annotationData.relation)

    bindAnnotationDataEvents(
      annotationData,
      editor,
      this._relationRenderer,
      entityRenderer
    )

    editor.eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) =>
        entityRenderer.updateEntityHtmlelement(typeName)
      )
      .on('textae-event.type-definition.attribute.change', (pred) =>
        entityRenderer.updateAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        entityRenderer.updateAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) =>
        this._relationRenderer.changeType(typeName)
      )

    this._editor = editor
    this._annotationData = annotationData
  }

  arrangeRelationPositionAll() {
    for (const relation of this._annotationData.relation.all) {
      relation.renderElementAgain()
    }
  }
}
