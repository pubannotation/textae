export default function(entities, annotationData, attrDef) {
  return entities.reduce((attrs, entityId) => {
    const attr = annotationData.entity
      .get(entityId)
      .attributes.find((a) => a.pred === attrDef.pred)
    if (attr) {
      attrs.push(attr)
    }
    return attrs
  }, [])
}
