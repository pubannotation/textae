import getDomPositionCache from '../getDomPositionCache'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import debounce from 'debounce'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import RelationRenderer from './RelationRenderer'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    buttonStateHelper,
    typeDefinition,
    typeGap,
    annotationPosition
  ) {
    const domPositionCache = getDomPositionCache(editor, annotationData.entity)
    const gridRenderer = new GridRenderer(editor, domPositionCache)
    const entityRenderer = new EntityRenderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition.entity,
      gridRenderer,
      typeGap
    )
    const relationRenderer = new RelationRenderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition
    )

    // Bind annotationPosition Events.
    annotationPosition.on('position-update.grid.end', (done) => {
      relationRenderer.arrangePositionAll()
      done()
    })

    const debouncedUpdateAnnotationPosition = debounce(
      () => annotationPosition.updateAsync(typeGap()),
      100
    )

    bindAnnotationDataEvents(
      annotationData,
      editor,
      domPositionCache,
      relationRenderer,
      typeGap,
      debouncedUpdateAnnotationPosition,
      gridRenderer,
      entityRenderer,
      buttonStateHelper,
      annotationPosition
    )

    bindTypeDefinitionEvents(typeDefinition, entityRenderer, relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._typeGap = typeGap
  }
}
