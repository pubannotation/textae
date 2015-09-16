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
  let or = (className, func, next) => selectOr(editorDom, className, func, selectionModel, shiftKey, next, (selected) => getLeftElement(editorDom, selected[0]))

  or(SPAN_CLASS, selectSpan, () => {
    or(LABEL_CLASS, selectEntityLabel, () => {
      or(ENTINY_CLASS, selectEntity)
    })
  })
}

function selectRight(editorDom, annotationData, selectionModel, typeContainer, shiftKey) {
  let or = (className, func, next) => selectOr(editorDom, className, func, selectionModel, shiftKey, next, (selected) => getRightElement(editorDom, selected[selected.length - 1]))

  or(SPAN_CLASS, selectSpan, () => {
    or(LABEL_CLASS, selectEntityLabel, () => {
      or(ENTINY_CLASS, selectEntity)
    })
  })
}

function selectOr(editorDom, className, selectFunc, selectionModel, shiftKey, next, getNextFunc) {
  let selected = selectSelected(editorDom, className)

  if (selected.length) {
    let left = getNextFunc(selected)
    selectFunc(selectionModel, left, shiftKey)
  } else {
    if (next)
      next()
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
