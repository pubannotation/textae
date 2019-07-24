import exists from './exists'
import destroySpanRecurcive from './destroySpanRecurcive'

export default function(span) {
  // Destroy rendered children.
  for (const child of span.children) {
    if (exists(child)) {
      destroySpanRecurcive(child)
    }
  }
  return span
}
