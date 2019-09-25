import setLabelToTypeLabel from '../setLabelToTypeLabel'
import setTypeColor from '../setTypeColor'

export default function(values, namespace, typeContainer, type) {
  setLabelToTypeLabel(
    values.querySelector('.textae-editor__type-label'),
    namespace,
    typeContainer,
    type
  )
  setTypeColor(values, typeContainer, type)
}
