export default function (entities, { pred }) {
  return entities
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === pred)
}
