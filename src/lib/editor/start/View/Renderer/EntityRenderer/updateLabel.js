import getTypeDom from '../getTypeDom'
import setLabelToTypeLabel from './setLabelToTypeLabel'

export default function(annotationData, typeContainer, type) {
  annotationData
    .entity
    .all()
    .filter(entity => entity.type === type)
    .map(entity => getTypeDom(entity.span, type))
    .map(dom => dom.find('.textae-editor__type-label'))
    .forEach(label => setLabelToTypeLabel(label[0], annotationData.namespace, typeContainer, type))
}
