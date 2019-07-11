export default function(annotationData, typeDefinition, relationId) {
    const type = annotationData.relation.get(relationId).type
    const colorHex = typeDefinition.relation.getColor(type)

    return {
      lineWidth: 1,
      strokeStyle: converseHEXinotRGBA(colorHex, 1)
    }
  }

  function converseHEXinotRGBA(color, opacity) {
    const c = color.slice(1),
      r = parseInt(c.substr(0, 2), 16),
      g = parseInt(c.substr(2, 2), 16),
      b = parseInt(c.substr(4, 2), 16)

    return `rgba(${r}, ${g}, ${b}, 1)`
  }
