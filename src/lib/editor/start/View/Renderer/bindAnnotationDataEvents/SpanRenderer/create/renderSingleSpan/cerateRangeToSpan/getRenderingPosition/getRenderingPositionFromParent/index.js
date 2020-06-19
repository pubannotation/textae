import getParentModel from './getParentModel'
import getOffset from '../getOffset'

export default function(span) {
  const parentModel = getParentModel(span)
  const { start, end } = getOffset(span, parentModel.begin)

  return {
    textNode: document.querySelector(`#${parentModel.id}`).firstChild,
    start,
    end
  }
}
