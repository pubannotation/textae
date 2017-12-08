import ModificationRenderer from '../ModificationRenderer'
import getDisplayName from './getDisplayName'
import uri from '../../../../uri'
import idFactory from '../../../../idFactory'
import getEntityDom from '../../../getEntityDom'
import createEntityUnlessBlock from './createEntityUnlessBlock'
import changeTypeOfExists from './changeTypeOfExists'
import removeEntityElement from './removeEntityElement'
import removeNoEntityPaneElement from './removeNoEntityPaneElement'
import updateLabel from './updateLabel'

export default function(editor, annotationData, selectionModel, typeContainer, gridRenderer, renderEntityHandler) {
  let modification = new ModificationRenderer(annotationData)

  return {
    render: (entity) => {
      createEntityUnlessBlock(
        editor,
        annotationData.namespace,
        typeContainer,
        gridRenderer,
        modification,
        entity
      )
      renderEntityHandler(entity)
    },
    change: (entity) => {
      changeTypeOfExists(
        editor,
        annotationData,
        selectionModel,
        typeContainer,
        gridRenderer,
        modification,
        entity
      )
      renderEntityHandler(entity)
    },
    changeModification: (entity) => changeModificationOfExists(
      editor,
      modification,
      entity
    ),
    remove: (entity) => destroy(
      editor,
      annotationData,
      gridRenderer,
      entity
    ),
    updateLabel: (type) => updateLabel(annotationData, typeContainer, type),
    updateLabelAll: () => {
      annotationData.entity.all().map((entity) => {
        updateLabel(annotationData, typeContainer, entity.type)
      })
    }
  }
}

function destroy(editor, annotationData, gridRenderer, entity) {
  if (doesSpanHasNoEntity(annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span)
  } else {
    // Destroy an each entity.
    const paneNode = removeEntityElement(editor, entity.id)

    removeNoEntityPaneElement(paneNode)
  }

  return entity
}

function changeModificationOfExists(editor, modification, entity) {
  var entityDom = getEntityDom(editor[0], entity.id)
  modification.update(entityDom, entity.id)
}

function doesSpanHasNoEntity(annotationData, spanId) {
  return annotationData.span.get(spanId).getTypes().length === 0
}
