import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function(annotationData, typeDefinition, relationId) {
  const type = annotationData.relation.get(relationId).type
  const colorHex = typeDefinition.relation.getColor(type)

  return {
    lineWidth: 1,
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}
