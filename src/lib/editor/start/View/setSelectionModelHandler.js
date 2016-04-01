import Selector from '../Selector'

export default function(editor, annotationData, selectionModel, buttonController) {
  var selector = new Selector(editor, annotationData)

  // Because entity.change is off at relation-edit-mode.
  selectionModel
    .on('span.select', selector.span.select)
    .on('span.deselect', selector.span.deselect)
    .on('span.change', buttonController.buttonStateHelper.updateBySpan)
    .on('entity.select', selector.entity.select)
    .on('entity.deselect', selector.entity.deselect)
    .on('relation.select', delay150(selector.relation.select))
    .on('relation.deselect', delay150(selector.relation.deselect))
    .on('relation.change', buttonController.buttonStateHelper.updateByRelation)
}

function delay150(func) {
  return _.partial(_.delay, func, 150)
}
