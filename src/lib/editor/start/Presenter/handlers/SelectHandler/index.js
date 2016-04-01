import {
  getLeftElement,
  getRightElement
}
from '../../../getNextElement'
import getEntityDom from '../../../getEntityDom'

const SPAN_CLASS = 'textae-editor__span',
  GRID_CLASS = 'textae-editor__grid',
  LABEL_CLASS = 'textae-editor__type-label',
  TYPE_CLASS = 'textae-editor__type',
  ENTINY_CLASS = 'textae-editor__entity'

export default function(editor, selectionModel) {
  let editorDom = editor[0]

  return {
    selectLeft: (option) => selectLeft(editorDom, selectionModel, option.shiftKey),
    selectRight: (option) => selectRight(editorDom, selectionModel, option.shiftKey),
    selectUp: () => selectUpperLayer(editorDom, selectionModel),
    selectDown: () => selectLowerLayer(editorDom, selectionModel),
    selectLeftFunc: () => selectLeftFunc(editorDom, selectionModel),
    selectRightFunc: () => selectRightFunc(editorDom, selectionModel)
  }
}

function selectLeft(editorDom, selectionModel, shiftKey) {
  let selectNext = selectLeftFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}

function selectRight(editorDom, selectionModel, shiftKey) {
  let selectNext = selectRightFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}

function selectUpperLayer(editorDom, selectionModel) {
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

function selectLowerLayer(editorDom, selectionModel) {
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

function selectLeftFunc(editorDom, selectionModel, shiftKey) {
  let getNextFunc = (selected) => getLeftElement(editorDom, selected[0])

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}

function selectRightFunc(editorDom, selectionModel, shiftKey) {
  let getNextFunc = (selected) => getRightElement(editorDom, selected[selected.length - 1])

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}

function selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc) {
  let selectedSpans = selectSelected(editorDom, SPAN_CLASS)

  if (selectedSpans.length) {
    let nextElement = getNextFunc(selectedSpans)
    return () => selectionModel.selectSpan(nextElement, shiftKey)
  }

  let selectedEntityLabel = selectSelected(editorDom, LABEL_CLASS)

  if (selectedEntityLabel.length) {
    let nextElement = getNextFunc(selectedEntityLabel)
    return () => selectionModel.selectEntityLabel(nextElement, shiftKey)
  }

  let selectedEntities = selectSelected(editorDom, ENTINY_CLASS)

  if (selectedEntities.length) {
    // return a select entity function
    let nextElement = getNextFunc(selectedEntities)
    return () => selectionModel.selectEntity(nextElement, shiftKey)
  }

  return () => {}
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

    selectionModel.selectEntityLabel(label)
  }
}

function selectFirstEntityOfEntityLabel(selectionModel, label) {
  let pane = label.nextElementSibling

  selectionModel.selectEntity(pane.children[0])
}

function selectSpanOfEntityLabel(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  let spanId = label.closest(`.${GRID_CLASS}`).id.substring(1)
  selectionModel.selectSingleSpanById(spanId)
}

function selectLabelOfEntity(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.')

  selectionModel.selectEntityLabel(entity.parentNode.previousElementSibling)
}
