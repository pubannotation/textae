import getTypeDom from '../../getTypeDom'
import updateLabel from './updateLabel'

export default function(annotationData, typeContainer, typeName) {
  annotationData.entity.all
    .filter((entity) => entity.type.name === typeName)
    .map((entity) => getTypeDom(entity))
    .filter((typeDom) => typeDom)
    .map((typeDom) => typeDom.querySelector('.textae-editor__type-values'))
    .filter((values) => values)
    .forEach((values) =>
      updateLabel(values, annotationData.namespace, typeContainer, typeName)
    )
}
