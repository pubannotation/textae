import DomPositionCache from '../DomPositionCache'
import renderParagraph from './renderParagraph'
import RenderAll from './RenderAll'
import renderModification from './renderModification'
import {
  EventEmitter as EventEmitter
}
from 'events'
import TypeStyle from '../TypeStyle'
import SpanRenderer from './SpanRenderer'
import GridRenderer from './GridRenderer'
import EntityRenderer from './EntityRenderer'
import AttributeRenderer from './AttributeRenderer'
import getTypeDom from './getTypeDom'
import $ from 'jquery'
import bindeToModelEvent from './bindeToModelEvent'

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


    const renderModificationEntityOrRelation = modification => {
      renderModification(annotationData, 'relation', modification, relationRenderer, buttonStateHelper)
      renderModification(annotationData, 'entity', modification, entityRenderer, buttonStateHelper)
    }

    bindEvents(domPositionCache, entityRenderer, relationRenderer, editor, spanRenderer, gridRenderer, renderModificationEntityOrRelation, this, annotationData)

    typeDefinition.entity
      .on('type.change', (id) => entityRenderer.updateLabel(id))
  }
}

function bindEvents(domPositionCache, entityRenderer, relationRenderer, editor, spanRenderer, gridRenderer, renderModificationEntityOrRelation, emitter, annotationData) {
  const chongeSpanOfEntity = (entity) => {
    // Change css class of the span according to the type is block or not.
    const span = annotationData.span.get(entity.span)
    return spanRenderer.change(span)
  }

  const eventMap = createEventMap(domPositionCache, entityRenderer, relationRenderer, editor, spanRenderer, gridRenderer, chongeSpanOfEntity, renderModificationEntityOrRelation)

  for (const [event, handler] of eventMap) {
    bindeToModelEvent(emitter, annotationData, event, handler)
  }
}

function createEventMap(domPositionCache, entityRenderer, relationRenderer, editor, spanRenderer, gridRenderer, chongeSpanOfEntity, renderModificationEntityOrRelation) {
  const renderAll = new RenderAll(editor, domPositionCache, spanRenderer, relationRenderer)
  const attributeRenderer = new AttributeRenderer(editor)

  return new Map([
    ['all.change', renderAll],
    ['config.change', () => {
      entityRenderer.updateLabelAll()
      relationRenderer.changeAll()
    }],
    ['paragraph.change', paragraphs => renderParagraph(editor, paragraphs)],
    ['span.add', (span) => spanRenderer.render(span)],
    ['span.move', ({oldId, newId}) => gridRenderer.changeId({oldId, newId})],
    ['span.remove', (span) => spanRenderer.remove(span)],
    ['entity.add', entity => {
      // Add a now entity with a new grid after the span moved.
      chongeSpanOfEntity(entity)
      entityRenderer.render(entity)
    }],
    ['entity.change', entity => {
      entityRenderer.change(entity)
      chongeSpanOfEntity(entity)
      gridRenderer.updateWidth(entity.span)
    }],
    ['entity.remove', entity => {
      entityRenderer.remove(entity)
      chongeSpanOfEntity(entity)
    }],
    ['attribute.add', attribute => {
      attributeRenderer.render(attribute)
    }],
    ['attribute.change', attribute => {
      attributeRenderer.change(attribute)
    }],
    ['attribute.remove', attribute => {
      attributeRenderer.remove(attribute)
    }],
    ['relation.add', relation => {
      relationRenderer.render(relation)
    }],
    ['relation.change', relation => {
      relationRenderer.change(relation)
    }],
    ['relation.remove', relation => {
      relationRenderer.remove(relation)
    }],
    ['modification.add', renderModificationEntityOrRelation],
    ['modification.remove', renderModificationEntityOrRelation]
  ])
}

