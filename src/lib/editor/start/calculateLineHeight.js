import * as lineHeight from './View/lineHeight'

export default function(editor, annotationData, typeContainer, typeGap, view) {
  lineHeight.setToTypeGap(editor[0], annotationData, typeContainer, typeGap())
  view.updateDisplay()
}
