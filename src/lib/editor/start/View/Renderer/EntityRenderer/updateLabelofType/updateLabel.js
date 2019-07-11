import setLabelToTypeLabel from '../setLabelToTypeLabel'
import setTypeColor from '../setTypeColor'

export default function(label, namespace, typeDefinition, type) {
  setLabelToTypeLabel(label, namespace, typeDefinition, type)
  setTypeColor(label, typeDefinition, type)
}
