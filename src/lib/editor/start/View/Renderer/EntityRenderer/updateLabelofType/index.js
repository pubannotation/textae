import getTypeDom from '../../getTypeDom'
import updateLabel from './updateLabel'

export default function(annotationData, typeDefinition, type) {
  annotationData
    .entity
    .all()
    .filter(entity => entity.type === type)
    .map(entity => getTypeDom(entity.span, type))
    .filter(typeDom => typeDom)
    .map(typeDom => typeDom.querySelector('.textae-editor__type-label'))
    .filter(label => label)
    .forEach(label => updateLabel(label, annotationData.namespace, typeDefinition, type))
}
