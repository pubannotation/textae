export default function (entities, { pred }) {
  return entities
    .reduce((attrs, entity) => {
      return attrs.concat(entity.attributes)
    }, [])
    .filter((a) => a.pred === pred)
}
