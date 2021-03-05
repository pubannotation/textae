import EntityRenderer from './EntityRenderer'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class Renderer {
  constructor(editor, annotationData, selectionModel) {
    const entityRenderer = new EntityRenderer(annotationData, selectionModel)
    this._relationRenderer = new RelationRenderer(editor, annotationData)

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
    this._relationRenderer.arrangePositionAll()
  }
}
