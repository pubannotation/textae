import {
  selectSpan,
  selectSingleSpanById
}
from './selectSpan'
import selectEntityLabel from './selectEntityLabel'
import selectEntity from './selectEntity'
import {
  getLeftElement, getRightElement
}
from '../../../getNextElement'
import getEntityDom from '../../../getEntityDom'

const SPAN_CLASS = 'textae-editor__span',
  GRID_CLASS = 'textae-editor__grid',
  LABEL_CLASS = 'textae-editor__type-label',
  TYPE_CLASS = 'textae-editor__type',
  ENTINY_CLASS = 'textae-editor__entity'

export default function(editor, annotationData, selectionModel, typeContainer) {
  let editorDom = editor[0]

  return {
    selectLeft: (option) => selectLeft(editorDom, annotationData, selectionModel, typeContainer, option.shiftKey),
    selectRight: (option) => selectRight(editorDom, annotationData, selectionModel, typeContainer, option.shiftKey),
    selectUp: () => selectUpperLayer(editorDom, annotationData, selectionModel),
    selectDown: () => selectLowerLayer(editorDom, annotationData, selectionModel)
  }
}

function selectLeft(editorDom, annotationData, selectionModel, typeContainer, shiftKey) {
  let selectedSpans = selectSelected(editorDom, SPAN_CLASS)

  // Spans are selected.
  if (selectedSpans.length) {
    let span = getLeftElement(editorDom, selectedSpans[0])
    selectSpan(selectionModel, span, shiftKey)
    return
  }

  // When one entity label is selected.
  let labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length) {
    let label = getLeftElement(editorDom, labels[0])
    selectEntityLabel(selectionModel, label, shiftKey)
    return
  }

  // When one entity is selected.
  let entities = selectSelected(editorDom, ENTINY_CLASS)
  if (entities.length) {
    let entity = getLeftElement(editorDom, entities[0])
    selectEntity(selectionModel, entity, shiftKey)
    return
  }
}

function selectRight(editorDom, annotationData, selectionModel, typeContainer, shiftKey) {
  let selectedSpans = selectSelected(editorDom, SPAN_CLASS)

  // Spans are selected.
  if (selectedSpans.length) {
    let span = getRightElement(editorDom, selectedSpans[selectedSpans.length - 1])
    selectSpan(selectionModel, span, shiftKey)
    return
  }

  // When one entity lable is selected.
  let labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length) {
    let label = getRightElement(editorDom, labels[labels.length - 1])
    selectEntityLabel(selectionModel, label, shiftKey)
    return
  }

  // When one entity is selected.
  let entities = selectSelected(editorDom, ENTINY_CLASS)
  if (entities.length) {
    let entity = getRightElement(editorDom, entities[entities.length - 1])
    selectEntity(selectionModel, entity, shiftKey)
    return
  }
}

function selectUpperLayer(editorDom, annotationData, selectionModel) {
  // When one span is selected.
  let spanId = selectionModel.span.single()
  if (spanId) {
    selectFirstEntityLabelOfSpan(selectionModel, spanId)
    return
  }

  // When one entity label is selected.
  let labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length === 1) {
    selectFirstEntityOfEntityLabel(selectionModel, labels[0])
    return
  }
}

function selectLowerLayer(editorDom, annotationData, selectionModel) {
  // When one entity label is selected.
  let labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length === 1) {
    selectSpanOfEntityLabel(selectionModel, labels[0])
    return
  }

  // When one entity is selected.
  let selectedEnities = selectSelected(editorDom, ENTINY_CLASS)
  if (selectedEnities.length === 1) {
    selectLabelOfEntity(selectionModel, selectedEnities[0])
    return
  }
}

function selectSelected(dom, className) {
  return dom.querySelectorAll(`.${className}.ui-selected`)
}

function selectFirstEntityLabelOfSpan(selectionModel, spanId) {
  let grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    let type = grid.querySelector(`.${TYPE_CLASS}`),
      label = type.querySelector(`.${LABEL_CLASS}`)

    selectEntityLabel(selectionModel, label)
  }
}

function selectFirstEntityOfEntityLabel(selectionModel, label) {
  let pane = label.nextElementSibling

  selectEntity(selectionModel, pane.children[0])
}

function selectSpanOfEntityLabel(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  let spanId = label.closest(`.${GRID_CLASS}`).id.substring(1)
  selectSingleSpanById(selectionModel, spanId)
}

function selectLabelOfEntity(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.')

  selectEntityLabel(selectionModel, entity.parentNode.previousElementSibling)
}
