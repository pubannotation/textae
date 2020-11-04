import AttributeModel from './AttributeModel'

export default function (attributes, entityContainer) {
  return attributes.map((a) => new AttributeModel(a, entityContainer))
}
