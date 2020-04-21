export default function(annotation) {
  const errors = []

  if (annotation.attributes) {
    const counter = annotation.attributes.reduce((counter, attr) => {
      const id = `${attr.subj}::${attr.pred}`
      if (counter.has(id)) {
        counter.get(id).push(attr.id)
      } else {
        counter.set(id, [attr.id])
      }
      return counter
    }, new Map())

    for (const attrs of counter.values()) {
      if (attrs.length > 1) {
        errors.push(attrs)
      }
    }
  }

  return errors
}
