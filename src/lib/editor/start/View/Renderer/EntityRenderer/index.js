import ModificationRenderer from '../ModificationRenderer'
import creat from './create'
import changeTypeOfExists from './changeTypeOfExists'
import updateLabelofType from './updateLabelofType'
import changeModificationOfExists from './changeModificationOfExists'
import destroy from './destroy'
import setTypeGapHeight from './setTypeGapHeight'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeDefinition,
    gridRenderer,
    typeGap
  ) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeDefinition = typeDefinition
    this.gridRenderer = gridRenderer
    this.selectionModel = selectionModel
    this.modification = new ModificationRenderer(annotationData)
    this.typeGap = typeGap
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

    setTypeGapHeight(entity, this.typeGap)
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

    setTypeGapHeight(entity, this.typeGap)
  }

  changeModification(entity) {
    changeModificationOfExists(this.editor, this.modification, entity)
  }

  remove(entity) {
    destroy(this.editor, this.annotationData, this.gridRenderer, entity)
  }

  updateLabel(type) {
    updateLabelofType(this.annotationData, this.typeDefinition, type)
  }

  updateLabelAll() {
    for (const entity of this.annotationData.entity.all()) {
      updateLabelofType(this.annotationData, this.typeDefinition, entity.type)
    }
  }
}
