import DomPositionCache from '../DomPositionCache'
import {
  EventEmitter as EventEmitter
}
from 'events'
import TypeStyle from '../TypeStyle'
import SpanRenderer from './SpanRenderer'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import getTypeDom from './getTypeDom'
import $ from 'jquery'
import bindEvents from './bindEvents'

export default class extends EventEmitter {
  constructor(editor, annotationData, selectionModel, buttonStateHelper, typeDefinition, typeGap, relationRenderer) {
    super()

    const domPositionCache = new DomPositionCache(editor, annotationData.entity)
    const gridRenderer = new GridRenderer(editor, domPositionCache)
    const renderEntityHandler = (entity) => $(getTypeDom(entity.span, entity.type)).css(new TypeStyle(typeGap()))
    const entityRenderer = new EntityRenderer(editor, annotationData, selectionModel, typeDefinition.entity, gridRenderer, renderEntityHandler)
    const spanRenderer = new SpanRenderer(
      annotationData,
      (type) => typeDefinition.entity.isBlock(type),
      (entity) => entityRenderer.render(entity)
    )

    bindEvents(this, domPositionCache, entityRenderer, relationRenderer, editor, spanRenderer, gridRenderer, buttonStateHelper, annotationData)

    typeDefinition.entity
      .on('type.change', (id) => entityRenderer.updateLabel(id))
  }
}
