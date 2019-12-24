import getValues from '../../../getValues'
import invalid from './invalid'
import valid from './valid'

export default function(element) {
  const { attributes } = getValues(element)
  const uniqPred = [...new Set(attributes.map((a) => a.pred))]

  if (attributes.length === uniqPred.length) {
    valid(element)
  } else {
    invalid(element)
  }
}
