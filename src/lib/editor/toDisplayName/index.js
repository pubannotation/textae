import getDisplayNameTag from './getDisplayNameTag'

export default function (relation, annotationData, typeDefinition) {
  return `[${relation.id}] ${getDisplayNameTag(
    annotationData.namespace,
    typeDefinition.relation,
    relation.typeName
  )}`
}
