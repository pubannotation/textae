import AttributeModel from './AttributeModel'

export default function(attributes) {
  attributes = attributes || []
  return attributes.map((a) => new AttributeModel(a))
}
