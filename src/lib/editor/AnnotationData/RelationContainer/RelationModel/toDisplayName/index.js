import getDisplayNameTag from './getDisplayNameTag'

export default function (relation, namespace, typeDefinition) {
  return `[${relation.id}] ${getDisplayNameTag(
    namespace,
    typeDefinition.relation,
    relation.typeName
  )}`
}
