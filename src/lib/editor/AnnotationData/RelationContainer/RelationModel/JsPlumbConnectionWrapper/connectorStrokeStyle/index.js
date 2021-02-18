import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (definitionContainer, relation) {
  const { typeName } = relation
  const colorHex = definitionContainer.getColor(typeName)

  return {
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}
