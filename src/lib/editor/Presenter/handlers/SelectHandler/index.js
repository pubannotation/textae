import selectSpan from './selectSpan'
import selectEntity from './selectEntity'
import selectNextSpan from './selectNextSpan'
import {
  selectLeftEntity, selectRightEntity
}
from './selectNextEntity'

export default function(editor, annotationData, selectionModel, typeContainer) {
  let editorDom = editor[0]

  return {
    selectLeft: () => selectLeft(editorDom, annotationData, selectionModel, typeContainer),
    selectRight: () => selectRight(editorDom, annotationData, selectionModel, typeContainer),
    selectUp: () => selectUpperLayer(editorDom, annotationData, selectionModel),
    selectDown: () => selectLowerLayer(editorDom, annotationData, selectionModel)
  }
}

function selectLeft(editorDom, annotationData, selectionModel, typeContainer) {
  selectNextSpan(annotationData, selectionModel, 'left')

  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let allLabels = editorDom.querySelectorAll('.textae-editor__type-label'),
      index = Array.from(allLabels).indexOf(labels[0])

    if (index > 0) {
      let prev = allLabels[index - 1]

      selectEntityLabel(selectionModel, prev)
    }
    return
  }

  selectLeftEntity(annotationData, selectionModel, typeContainer)
}

function selectRight(editorDom, annotationData, selectionModel, typeContainer) {
  selectNextSpan(annotationData, selectionModel, 'right')

  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let allLabels = editorDom.querySelectorAll('.textae-editor__type-label'),
      index = Array.from(allLabels).indexOf(labels[0])

    if (allLabels.length - index > 1) {
      let next = allLabels[index + 1]

      selectEntityLabel(selectionModel, next)
    }
    return
  }

  selectRightEntity(annotationData, selectionModel, typeContainer)
}

function selectEntityLabel(selectionModel, dom) {
  console.assert(selectionModel, 'selectionModel MUST not be undefined')
  console.assert(dom, 'dom MUST not be undefined')

  let pane = dom.nextElementSibling,
    children = pane.children,
    ids = Array.from(children).map(dom => dom.title)

  selectEntities(selectionModel, ids)
}

function selectUpperLayer(editorDom, annotationData, selectionModel) {
  let spanId = selectionModel.span.single()
  if (spanId) {
    let span = annotationData.span.get(spanId),
      types = span.getTypes(),
      entities = types[0].entities

    selectEntities(selectionModel, entities)
    return
  }

  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let label = labels[0],
      pane = label.nextElementSibling,
      children = pane.children,
      id = children[0].title

    selectEntity(selectionModel, id)
  }
}

function selectLowerLayer(editorDom, annotationData, selectionModel) {
  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let label = labels[0],
      pane = label.nextElementSibling,
      children = pane.children,
      entityId = children[0].title,
      entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span)

    selectSpan(selectionModel, span)
    return
  }

  let entityId = selectionModel.entity.single()
  if (entityId) {
    let entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span),
      type = span.getTypes().filter(type => type.name === entity.type)[0],
      ids = type.entities

    selectEntities(selectionModel, ids)
  }
}

function selectEntities(selectionModel, ids) {
  selectionModel.clear()
  ids.forEach(id => selectionModel.entity.add(id))
}
