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

export default function(domPositionCache, relationRenderer, buttonStateHelper, typeGap, editor, annotationData, selectionModel, typeDefinition) {
  const emitter = new EventEmitter()
  const gridRenderer = new GridRenderer(editor, domPositionCache)
  const renderEntityHandler = (entity) => $(getTypeDom(entity.span, entity.type)).css(new TypeStyle(typeGap()))
  const entityRenderer = new EntityRenderer(editor, annotationData, selectionModel, typeDefinition.entity, gridRenderer, renderEntityHandler)
  const attributeRenderer = new AttributeRenderer(editor)
  const spanRenderer = new SpanRenderer(
    annotationData,
    (type) => typeDefinition.entity.isBlock(type),
    (entity) => entityRenderer.render(entity)
  )

  return (editor, annotationData, selectionModel) => {
    const renderAll = new RenderAll(editor, domPositionCache, spanRenderer, relationRenderer)

    const chongeSpanOfEntity = (entity) => {
      // Change css class of the span according to the type is block or not.
      const span = annotationData.span.get(entity.span)
      return spanRenderer.change(span)
    }

    const renderModificationEntityOrRelation = modification => {
      renderModification(annotationData, 'relation', modification, relationRenderer, buttonStateHelper)
      renderModification(annotationData, 'entity', modification, entityRenderer, buttonStateHelper)
    }

    const eventHandlers = new Map([
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

    for (let eventHandler of eventHandlers) {
      bindeToModelEvent(emitter, annotationData, eventHandler[0], eventHandler[1])
    }

    typeDefinition.entity
      .on('type.change', (id) => entityRenderer.updateLabel(id))

    return emitter
  }
}

function bindeToModelEvent(emitter, annotationData, eventName, handler) {
  annotationData.on(eventName, param => {
    handler(param)
    emitter.emit(eventName)
  })
}
