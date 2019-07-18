import {
  getLeftElement,
  getRightElement
}
from '../../../../getNextElement'

const SPAN_CLASS = 'textae-editor__span'
const GRID_CLASS = 'textae-editor__grid'
const LABEL_CLASS = 'textae-editor__type-label'
const TYPE_CLASS = 'textae-editor__type'
const ENTINY_CLASS = 'textae-editor__entity'

export default function(editorDom, selectionModel) {
  return {
    selectLeft(option) {
      selectLeft(editorDom, selectionModel, option.shiftKey)
    },
    selectRight(option = {}) {
      selectRight(editorDom, selectionModel, option.shiftKey)
    },
    selectUp() {
      selectUpperLayer(editorDom, selectionModel)
    },
    selectDown() {
      selectLowerLayer(editorDom, selectionModel)
    }
  }
}

function selectLeft(editorDom, selectionModel, shiftKey) {
  const selectNext = selectLeftFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}

function selectRight(editorDom, selectionModel, shiftKey) {
  const selectNext = selectRightFunc(editorDom, selectionModel, shiftKey)
  selectNext()
}

function selectUpperLayer(editorDom, selectionModel) {
  // When one span is selected.
  const spanId = selectionModel.span.single()
  if (spanId) {
    selectFirstEntityLabelOfSpan(selectionModel, spanId)
    return
  }

  // When one entity label is selected.
  const labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length === 1) {
    selectFirstEntityOfEntityLabel(selectionModel, labels[0])
    return
  }
}

function selectLowerLayer(editorDom, selectionModel) {
  // When one entity label is selected.
  const labels = selectSelected(editorDom, LABEL_CLASS)
  if (labels.length === 1) {
    selectSpanOfEntityLabel(selectionModel, labels[0])
    return
  }

  // When one entity is selected.
  const selectedEnities = selectSelected(editorDom, ENTINY_CLASS)
  if (selectedEnities.length === 1) {
    selectLabelOfEntity(selectionModel, selectedEnities[0])
    return
  }
}

function selectLeftFunc(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected) => getLeftElement(editorDom, selected[0])

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}

function selectRightFunc(editorDom, selectionModel, shiftKey) {
  const getNextFunc = (selected) => getRightElement(editorDom, selected[selected.length - 1])

  return selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc)
}

function selectNextFunc(editorDom, selectionModel, shiftKey, getNextFunc) {
  const selectedSpans = selectSelected(editorDom, SPAN_CLASS)

  if (selectedSpans.length) {
    const nextElement = getNextFunc(selectedSpans)
    return () => selectionModel.selectSpan(nextElement, shiftKey)
  }

  const selectedEntityLabel = selectSelected(editorDom, LABEL_CLASS)

  if (selectedEntityLabel.length) {
    const nextElement = getNextFunc(selectedEntityLabel)
    return () => selectionModel.selectEntityLabel(nextElement, shiftKey)
  }

  const selectedEntities = selectSelected(editorDom, ENTINY_CLASS)

  if (selectedEntities.length) {
    // return a select entity function
    const nextElement = getNextFunc(selectedEntities)
    return () => selectionModel.selectEntity(nextElement, shiftKey)
  }

  return () => {}
}

function selectSelected(dom, className) {
  return dom.querySelectorAll(`.${className}.ui-selected`)
}

function selectFirstEntityLabelOfSpan(selectionModel, spanId) {
  const grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    const type = grid.querySelector(`.${TYPE_CLASS}`)
    const label = type.querySelector(`.${LABEL_CLASS}`)

    selectionModel.selectEntityLabel(label)
  }
}

function selectFirstEntityOfEntityLabel(selectionModel, label) {
  const pane = label.previousElementSibling

  selectionModel.selectEntity(pane.children[0])
}

function selectSpanOfEntityLabel(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  const spanId = label.closest(`.${GRID_CLASS}`).id.substring(1)
  selectionModel.selectSingleSpanById(spanId)
}

function selectLabelOfEntity(selectionModel, entity) {
  console.assert(entity, 'An entity MUST exists.')

  selectionModel.selectEntityLabel(entity.parentNode.previousElementSibling)
}
