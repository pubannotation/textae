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

export default function(domPositionCaChe, relationRenderer, buttonStateHelper, typeGap, editor, model, typeContainer) {
  let emitter = new EventEmitter(),
    gridRenderer = new GridRenderer(editor, domPositionCaChe),
    renderEntityHandler = (entity) => getTypeDom(entity.span, entity.type).css(new TypeStyle(typeGap())),
    entityRenderer = new EntityRenderer(editor, model, typeContainer.entity, gridRenderer, renderEntityHandler),
    spanRenderer = new SpanRenderer(
      model.annotationData,
      typeContainer.entity.isBlock,
      entityRenderer.render
    )

  return (editor, annotationData, selectionModel) => {
    let renderAll = new RenderAll(editor, domPositionCaChe, spanRenderer, relationRenderer),
      chongeSpanOfEntity = (entity) => {
        // Change css class of the span according to the type is block or not.
        let span = annotationData.span.get(entity.span)
        return spanRenderer.change(span)
      },
      renderModificationEntityOrRelation = modification => {
        renderModification(annotationData, 'relation', modification, relationRenderer, buttonStateHelper)
        renderModification(annotationData, 'entity', modification, entityRenderer, buttonStateHelper)
      }

    let eventHandlers = [
      ['all.change', annotationData => {
        renderAll(annotationData)
        selectionModel.clear()
      }],
      ['paragraph.change', paragraphs => renderParagraph(editor, paragraphs)],
      ['span.add', spanRenderer.render],
      ['span.remove', span => {
        spanRenderer.remove(span)
        gridRenderer.remove(span.id)
        selectionModel.span.remove(modelToId(span))
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
        selectionModel.entity.remove(modelToId(entity))
      }],
      ['relation.add', relation => {
        relationRenderer.render(relation)
        emitter.emit('relation.add', relation)
      }],
      ['relation.change', relationRenderer.change],
      ['relation.remove', relation => {
        relationRenderer.remove(relation)
        selectionModel.relation.remove(modelToId(relation))
      }],
      ['modification.add', renderModificationEntityOrRelation],
      ['modification.remove', renderModificationEntityOrRelation]
    ]

    eventHandlers.forEach(eventHandler => bindeToModelEvent(emitter, annotationData, eventHandler[0], eventHandler[1]))

    return emitter
  }
}

function modelToId(modelElement) {
  return modelElement.id
}

function bindeToModelEvent(emitter, annotationData, eventName, handler) {
  annotationData.on(eventName, param => {
    handler(param)
    emitter.emit(eventName)
  })
}
