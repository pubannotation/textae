import importSource from '../../importSource'
import translateAttribute from './translateAttribute'

export default function(attribute, attributes, prefix) {
  importSource(
    [attribute],
    (attribute) => translateAttribute(prefix, attribute),
    attributes
  )
}
