import renderParagraph from './renderParagraph'
import getAnnotationBox from './getAnnotationBox'
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
import getTypeDom from './getTypeDom'
import modelToId from '../../../modelToId'

export default function(domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, annotationData, selectionModel, typeContainer) {
  const emitter = new EventEmitter(),
    gridRenderer = new GridRenderer(editor, domPositionCaChe),
    renderEntityHandler = (entity) => getTypeDom(entity.span, entity.type).css(new TypeStyle(typeGap())),
    entityRenderer = new EntityRenderer(editor, annotationData, selectionModel, typeContainer.entity, gridRenderer, renderEntityHandler),
    spanRenderer = new SpanRenderer(
      annotationData,
      typeContainer.entity.isBlock,
      entityRenderer.render
    )

  return (editor, annotationData, selectionModel) => {
    const renderAll = new RenderAll(editor, domPositionCaChe, spanRenderer, relationRenderer),
      chongeSpanOfEntity = (entity) => {
        // Change css class of the span according to the type is block or not.
        const span = annotationData.span.get(entity.span)
        return spanRenderer.change(span)
      },
      renderModificationEntityOrRelation = modification => {
        renderModification(annotationData, 'relation', modification, relationRenderer, buttonStateHelper)
        renderModification(annotationData, 'entity', modification, entityRenderer, buttonStateHelper)
      }

    const eventHandlers = new Map([
      ['all.change', renderAll],
      ['paragraph.change', paragraphs => renderParagraph(editor, paragraphs)],
      ['span.add', spanRenderer.render],
      ['span.remove', span => {
        spanRenderer.remove(span)
        gridRenderer.remove(span.id)
      }],
      ['entity.add', entity => {
        // Add a now entity with a new grid after the span moved.
        chongeSpanOfEntity(entity)
        entityRenderer.render(entity)
      }],
      ['entity.change', entity => {
        entityRenderer.change(entity)
        chongeSpanOfEntity(entity)
      }],
      ['entity.remove', entity => {
        entityRenderer.remove(entity)
        chongeSpanOfEntity(entity)
      }],
      ['relation.add', relation => {
        relationRenderer.render(relation)
      }],
      ['relation.change', relationRenderer.change],
      ['relation.remove', relation => {
        relationRenderer.remove(relation)
      }],
      ['modification.add', renderModificationEntityOrRelation],
      ['modification.remove', renderModificationEntityOrRelation]
    ])

    for (let eventHandler of eventHandlers) {
      bindeToModelEvent(emitter, annotationData, eventHandler[0], eventHandler[1])
    }

    typeContainer.entity
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
