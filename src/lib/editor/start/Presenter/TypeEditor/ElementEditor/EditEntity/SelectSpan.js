import _ from 'underscore'

export default function(editor, annotationData, selectionModel, typeContainer) {
  let getBlockEntities = function(spanId) {
      return _.flatten(
        annotationData.span.get(spanId)
        .getTypes()
        .filter(function(type) {
          return typeContainer.entity.isBlock(type.name)
        })
        .map(function(type) {
          return type.entities
        })
      )
    },
    operateSpanWithBlockEntities = function(method, spanId) {
      selectionModel.span[method](spanId)
      if (editor.find('#' + spanId).hasClass('textae-editor__span--block')) {
        getBlockEntities(spanId).forEach(selectionModel.entity[method])
      }
    },
    selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'add'),
    toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'toggle')

  return function(event) {
    let firstId = selectionModel.span.single(),
      target = event.target,
      id = target.id

    if (event.shiftKey && firstId) {
      // select reange of spans.
      selectionModel.clear()
      annotationData.span.range(firstId, id)
        .forEach(function(spanId) {
          selectSpanWithBlockEnities(spanId)
        })
    } else if (event.ctrlKey || event.metaKey) {
      toggleSpanWithBlockEnities(id)
    } else {
      selectionModel.clear()
      selectSpanWithBlockEnities(id)
    }
  }
}
