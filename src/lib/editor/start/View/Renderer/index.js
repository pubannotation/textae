import EntityRenderer from './EntityRenderer'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
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

    bindTypeDefinitionEvents(editor, entityRenderer, this._relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
  }

  arrangeRelationPositionAll() {
    for (const relation of this._annotationData.relation.all) {
      relation.renderElementAgain()
    }
  }
}
