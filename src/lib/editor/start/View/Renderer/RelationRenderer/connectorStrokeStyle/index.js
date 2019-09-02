import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function(annotationData, typeDefinition, relationId) {
  const typeName = annotationData.relation.get(relationId).type.name
  const colorHex = typeDefinition.relation.getColor(typeName)

  return {
    lineWidth: 1,
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}
