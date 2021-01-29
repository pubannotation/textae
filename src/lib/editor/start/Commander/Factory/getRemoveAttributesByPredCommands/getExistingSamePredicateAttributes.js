export default function (entities, { pred }) {
  return entities.reduce((attrs, entity) => {
    for (const attr of entity.attributes.filter((a) => a.pred === pred)) {
      attrs.push(attr)
    }
    return attrs
  }, [])
}
