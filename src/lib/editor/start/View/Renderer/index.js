import getSpanPositionCache from '../getSpanPositionCache'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeDefinition,
    typeGap,
    textBox
  ) {
    const spanPositionCache = getSpanPositionCache(editor)
    const gridRenderer = new GridRenderer(editor, spanPositionCache)
    const entityRenderer = new EntityRenderer(
      editor,
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
      textBox
    )

    bindTypeDefinitionEvents(editor, entityRenderer, this._relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._typeGap = typeGap
  }

  arrangeRelationPositionAllAsync() {
    return new Promise((resolve) => {
      this._relationRenderer.arrangePositionAll()
      resolve()
    })
  }
}
