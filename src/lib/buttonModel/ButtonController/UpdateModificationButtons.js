import _ from 'underscore'

export default function(annotationData, modeAccordingToButton) {
  var doesAllModificaionHasSpecified = function(specified, modificationsOfSelectedElement) {
      return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function(m) {
        return _.contains(m, specified)
      })
    },
    updateModificationButton = function(specified, modificationsOfSelectedElement) {
      // All modification has specified modification if exits.
      modeAccordingToButton[specified.toLowerCase()]
        .value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement))
    }

  return function(selectionModel) {
    var modifications = selectionModel.all().map(function(e) {
      return annotationData.getModificationOf(e).map(function(m) {
        return m.pred
      })
    })

    updateModificationButton('Negation', modifications)
    updateModificationButton('Speculation', modifications)
  }
}
