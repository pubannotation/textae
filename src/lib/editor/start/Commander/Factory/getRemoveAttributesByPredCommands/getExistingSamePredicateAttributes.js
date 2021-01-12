export default function (entities, attrDef) {
  return entities.reduce((attrs, entity) => {
    for (const attr of entity.attributes.filter(
      (a) => a.pred === attrDef.pred
    )) {
      attrs.push(attr)
    }
    return attrs
  }, [])
}
