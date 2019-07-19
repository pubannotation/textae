import setLabelToTypeLabel from '../setLabelToTypeLabel'
import setTypeColor from '../setTypeColor'

export default function(values, namespace, typeDefinition, type) {
  setLabelToTypeLabel(values.querySelector('.textae-editor__type-label'), namespace, typeDefinition, type)
  setTypeColor(values, typeDefinition, type)
}
