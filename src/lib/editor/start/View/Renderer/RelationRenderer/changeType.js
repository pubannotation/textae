import toLabelString from '../../../../toLabelString'

export default function (annotationData, typeDefinition, relation) {
  const jsPlumbConnection = relation.jsPlumbConnection
  jsPlumbConnection.setColor()
  jsPlumbConnection.label = toLabelString(
    relation,
    annotationData,
    typeDefinition
  )
}
