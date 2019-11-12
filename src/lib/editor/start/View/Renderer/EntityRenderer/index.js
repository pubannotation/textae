import ModificationRenderer from '../ModificationRenderer'
import create from './create'
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
    typeCantainer,
    gridRenderer,
    typeGap
  ) {
    this.editor = editor
    this.annotationData = annotationData
    this.typeContainer = typeCantainer
    this.gridRenderer = gridRenderer
    this.selectionModel = selectionModel
    this.modification = new ModificationRenderer(annotationData)
    this.typeGap = typeGap
  }

  render(entity) {
    create(
      this.editor,
      this.typeContainer,
      this.gridRenderer,
      this.modification,
      entity,
      this.annotationData.namespace
    )

    setTypeGapHeight(entity, this.typeGap)
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

    setTypeGapHeight(entity, this.typeGap)
  }

  changeModification(entity) {
    changeModificationOfExists(this.editor, this.modification, entity)
  }

  remove(entity) {
    destroy(this.editor, this.annotationData, this.gridRenderer, entity)
  }

  updateLabel(typeName) {
    updateLabelofType(this.annotationData, this.typeContainer, typeName)
  }

  updateLabelAll() {
    for (const entity of this.annotationData.entity.all) {
      updateLabelofType(
        this.annotationData,
        this.typeContainer,
        entity.type.name
      )
    }
  }
}
