import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class Renderer {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeDefinition,
    typeGap,
    textBox,
    gridRectangle
  ) {
    const gridRenderer = new GridRenderer(editor, textBox, gridRectangle)
    const entityRenderer = new EntityRenderer(
      annotationData,
      selectionModel,
      typeDefinition.entity,
      gridRenderer,
      typeGap
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
      entityRenderer,
      textBox,
      gridRectangle
    )

    bindTypeDefinitionEvents(editor, entityRenderer, this._relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._typeGap = typeGap
  }

  arrangeRelationPositionAll() {
    this._relationRenderer.arrangePositionAll()
  }
}
