export default function(annotation) {
  if (!annotation.attributes) {
    return new Map()
  }

  const counter = annotation.attributes.reduce((counter, attr) => {
    const id = `Predicate "${attr.pred}" of denotation "${attr.subj}"`
    if (counter.has(id)) {
      counter.get(id).push(attr.id)
    } else {
      counter.set(id, [attr.id])
    }
    return counter
  }, new Map())

  for (const [pred, attrs] of counter.entries()) {
    if (attrs.length === 1) {
      counter.delete(pred)
    }
  }

  return counter
}
