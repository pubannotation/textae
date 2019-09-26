import getValues from '../getValues'
import invalid from './invalid'
import valid from './valid'

export default function(element) {
  const { attributes } = getValues(element)
  if (attributes.length < 2) {
    valid(element)
    return
  }
  let prevValue = undefined
  for (const input of attributes) {
    if (prevValue !== undefined) {
      if (prevValue !== input.pred) {
        valid(element)
        return
      }
    }
    prevValue = input.pred
  }
  invalid(element)
}
