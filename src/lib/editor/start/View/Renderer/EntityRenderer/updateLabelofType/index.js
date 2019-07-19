import getTypeDom from '../../getTypeDom'
import updateLabel from './updateLabel'

export default function(annotationData, typeDefinition, type) {
  annotationData
    .entity
    .all()
    .filter(entity => entity.type === type)
    .map(entity => getTypeDom(entity.span, type))
    .filter(typeDom => typeDom)
    .map(typeDom => typeDom.querySelector('.textae-editor__type-values'))
    .filter(values => values)
    .forEach(values => updateLabel(values, annotationData.namespace, typeDefinition, type))
}
