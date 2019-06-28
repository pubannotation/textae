import ModificationRenderer from '../ModificationRenderer'
import createEntityUnlessBlock from './createEntityUnlessBlock'
import changeTypeOfExists from './changeTypeOfExists'
import updateLabel from './updateLabel'
import changeModificationOfExists from './changeModificationOfExists'
import destroy from './destroy'

export default class {
  constructor(editor, annotationData, selectionModel, typeContainer, gridRenderer, renderEntityHandler) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeContainer
    this.gridRenderer = gridRenderer
    this.renderEntityHandler = renderEntityHandler
    this.selectionModel = selectionModel
    this.modification = new ModificationRenderer(annotationData)
  }

  render(entity) {
    createEntityUnlessBlock(
      this.editor,
      this.annotationData.namespace,
      this.typeContainer,
      this.gridRenderer,
      this.modification,
      entity
    )

    this.renderEntityHandler(entity)
  }

  change(entity) {
    changeTypeOfExists(
      this.editor,
      this.annotationData,
      this.selectionModel,
      this.typeContainer,
      this.gridRenderer,
      this.modification,
      entity
    )
    this.renderEntityHandler(entity)
  }

  changeModification(entity) {
    changeModificationOfExists(
      this.editor,
      this.modification,
      entity
    )
  }

  remove(entity) {
     destroy(
      this.editor,
      this.annotationData,
      this.gridRenderer,
      entity
    )
  }

  updateLabel(type) {
    updateLabel(this.annotationData, this.typeContainer, type)
  }

  updateLabelAll() {
    this.annotationData.entity.all().map((entity) => {
      updateLabel(this.annotationData, this.typeContainer, entity.type)
    })
  }
}
