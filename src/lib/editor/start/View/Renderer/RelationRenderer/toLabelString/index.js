import getLabelTag from './getLabelTag'

export default function (relation, annotationData, typeDefinition) {
  return `[${relation.id}] ${getLabelTag(
    annotationData.namespace,
    typeDefinition.relation,
    relation.typeName
  )}`
}
