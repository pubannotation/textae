import AttributeModel from './AttributeModel'

export default function(attributes, entityContainer) {
  attributes = attributes || []
  return attributes.map((a) => new AttributeModel(a, entityContainer))
}
