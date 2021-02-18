import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (typeContainer, relation) {
  const { typeName } = relation
  const colorHex = typeContainer.getColor(typeName)

  return {
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}
