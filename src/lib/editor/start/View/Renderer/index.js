import DomPositionCache from '../DomPositionCache'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import debounce from 'debounce'
import bindTypeDefinitionEvents from './bindTypeDefinitionEvents'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    buttonStateHelper,
    typeDefinition,
    typeGap,
    relationRenderer,
    annotationPosition
  ) {
    const domPositionCache = new DomPositionCache(editor, annotationData.entity)
    const gridRenderer = new GridRenderer(editor, domPositionCache)
    const entityRenderer = new EntityRenderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition.entity,
      gridRenderer,
      typeGap
    )
    const debouncedUpdateAnnotationPosition = debounce(
      () => annotationPosition.updateAsync(typeGap()),
      100
    )

    bindAnnotationDataEvents(
      annotationData,
      editor,
      domPositionCache,
      relationRenderer,
      typeDefinition,
      typeGap,
      debouncedUpdateAnnotationPosition,
      gridRenderer,
      entityRenderer,
      buttonStateHelper
    )

    bindTypeDefinitionEvents(typeDefinition, entityRenderer, relationRenderer)

    this._editor = editor
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
    this._typeGap = typeGap
  }
}
