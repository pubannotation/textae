import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (definitionContainer, relation) {
  return {
    strokeStyle: converseHEXinotRGBA(relation.getColor(definitionContainer))
  }
}
