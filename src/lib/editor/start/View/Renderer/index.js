import DomPositionCache from '../DomPositionCache'
import { EventEmitter } from 'events'
import SpanRenderer from './SpanRenderer'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import bindEvents from './bindEvents'

export default class extends EventEmitter {
  constructor(
    editor,
    annotationData,
    selectionModel,
    buttonStateHelper,
    typeDefinition,
    typeGap,
    relationRenderer
  ) {
    super()

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
    const spanRenderer = new SpanRenderer(
      annotationData,
      (type) => typeDefinition.entity.isBlock(type),
      (entity) => entityRenderer.render(entity)
    )

    bindEvents(
      this,
      domPositionCache,
      entityRenderer,
      relationRenderer,
      editor,
      spanRenderer,
      gridRenderer,
      buttonStateHelper,
      annotationData
    )

    typeDefinition.entity.on('type.change', (id) =>
      entityRenderer.updateLabel(id)
    )
  }
}
