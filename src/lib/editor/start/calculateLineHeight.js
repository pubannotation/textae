import setLineHeightToTypeGap from './View/setLineHeightToTypeGap'

export default function(editor, annotationData, typeGap, view) {
  setLineHeightToTypeGap(editor[0], annotationData, typeGap())
  view.updateDisplay()
}
