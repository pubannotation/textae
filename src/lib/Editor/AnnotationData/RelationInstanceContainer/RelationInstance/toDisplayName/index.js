import getDisplayNameTag from './getDisplayNameTag'

export default function (relation, namespace, definitionContainer) {
  return `[${relation.id}] ${getDisplayNameTag(
    namespace,
    definitionContainer,
    relation.typeName
  )}`
}
