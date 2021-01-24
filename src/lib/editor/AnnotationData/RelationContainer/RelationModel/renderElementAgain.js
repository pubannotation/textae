import toDisplayName from '../../../toDisplayName'

export default function (annotationData, typeDefinition, relation) {
  const jsPlumbConnection = relation.jsPlumbConnection
  jsPlumbConnection.setColor()
  jsPlumbConnection.label = toDisplayName(
    relation,
    annotationData,
    typeDefinition
  )
}
