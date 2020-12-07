import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class Renderer {
  constructor(editor, annotationData, selectionModel, typeDefinition, textBox) {
    const gridRenderer = new GridRenderer(editor)
    const entityRenderer = new EntityRenderer(
      annotationData,
      selectionModel,
      typeDefinition.denotation,
      typeDefinition.block,
      gridRenderer
    )
    this._relationRenderer = new RelationRenderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition
    )

    bindAnnotationDataEvents(
      annotationData,
      editor,
      this._relationRenderer,
      gridRenderer,
      entityRenderer
    )

    bindTypeDefinitionEvents(editor, entityRenderer, this._relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
  }

  arrangeRelationPositionAll() {
    this._relationRenderer.arrangePositionAll()
  }
}
