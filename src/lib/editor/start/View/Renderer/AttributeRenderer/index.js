import getTypeDom from '../getTypeDom'
import create from './create'

export default function(editor, annotationData, selectionModel, typeContainer, gridRenderer) {
  return {
    render: (attributeModel, entityModels) => {
      create(
        editor,
        annotationData.namespace,
        typeContainer,
        gridRenderer,
        attributeModel,
        entityModels
      )
    },
    change: () => {},
    changeModification: () => {},
    remove: () => {},
    updateLabel: () => {}
  }
}
