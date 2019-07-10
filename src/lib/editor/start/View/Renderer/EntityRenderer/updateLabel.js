import setLabelToTypeLabel from './setLabelToTypeLabel'
import setTypeColor from './setTypeColor'

export default function(label, namespace, typeContainer, type) {
  setLabelToTypeLabel(label, namespace, typeContainer, type)
  setTypeColor(label, typeContainer, type)
}
