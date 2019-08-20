import setLineHeightToTypeGap from './View/setLineHeightToTypeGap'

export default function(editor, annotationData, typeDefinition, typeGap, view) {
  setLineHeightToTypeGap(editor[0], annotationData, typeDefinition, typeGap())
  view.updateDisplay()
}
