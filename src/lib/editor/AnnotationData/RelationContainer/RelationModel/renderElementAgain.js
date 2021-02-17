import toDisplayName from './toDisplayName'

export default function (annotationData, typeDefinition, relation) {
  const { jsPlumbConnection } = relation
  jsPlumbConnection.resetColor()
  jsPlumbConnection.label = toDisplayName(
    relation,
    annotationData.namespace,
    typeDefinition
  )
}
