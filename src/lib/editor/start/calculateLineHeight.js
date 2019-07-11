import * as lineHeight from './View/lineHeight'

export default function(editor, annotationData, typeDefinition, typeGap, view) {
  lineHeight.setToTypeGap(editor[0], annotationData, typeDefinition, typeGap())
  view.updateDisplay()
}
