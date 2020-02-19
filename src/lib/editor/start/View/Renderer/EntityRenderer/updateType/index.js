import updateTypeLabel from './updateTypeLabel'
import updateTypeColor from './updateTypeColor'

export default function(namespace, typeContainer, type) {
  updateTypeLabel(namespace, typeContainer, type)
  updateTypeColor(typeContainer, type)
}
