import ModificationRenderer from '../ModificationRenderer'
import creat from './create'
import changeTypeOfExists from './changeTypeOfExists'
import updateLabelofType from './updateLabelofType'
import changeModificationOfExists from './changeModificationOfExists'
import destroy from './destroy'

export default class {
  constructor(editor, annotationData, selectionModel, typeDefinition, gridRenderer, renderEntityHandler) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.gridRenderer = gridRenderer
    this.renderEntityHandler = renderEntityHandler
    this.selectionModel = selectionModel
    this.modification = new ModificationRenderer(annotationData)
  }

  render(entity) {
    creat(
      this.editor,
      this.annotationData.namespace,
      this.typeDefinition,
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
      this.typeDefinition,
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
    updateLabelofType(this.annotationData, this.typeDefinition, type)
  }

  updateLabelAll() {
    this.annotationData.entity.all().map((entity) => {
      updateLabelofType(this.annotationData, this.typeDefinition, entity.type)
    })
  }
}
