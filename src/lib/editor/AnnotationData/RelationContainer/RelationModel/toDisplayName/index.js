import getDisplayNameTag from './getDisplayNameTag'

export default function (relation, namespace, typeContainer) {
  return `[${relation.id}] ${getDisplayNameTag(
    namespace,
    typeContainer,
    relation.typeName
  )}`
}
