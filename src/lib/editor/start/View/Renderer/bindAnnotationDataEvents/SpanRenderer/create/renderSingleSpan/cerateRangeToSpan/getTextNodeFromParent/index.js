import getParentModel from './getParentModel'

export default function(span) {
  const parentModel = getParentModel(span)

  return [
    document.querySelector(`#${parentModel.id}`).firstChild,
    parentModel.begin
  ]
}
