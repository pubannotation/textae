export default function (entities, attrDef) {
  return entities.reduce((attrs, entity) => {
    const attr = entity.attributes.find((a) => a.pred === attrDef.pred)
    if (attr) {
      attrs.push(attr)
    }
    return attrs
  }, [])
}
