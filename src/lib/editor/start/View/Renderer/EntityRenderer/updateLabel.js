import setLabelToTypeLabel from './setLabelToTypeLabel'
import setTypeColor from './setTypeColor'

export default function(label, annotationData, typeContainer, type) {
  setLabelToTypeLabel(label, annotationData.namespace, typeContainer, type)
  setTypeColor(label, typeContainer, type)
}
