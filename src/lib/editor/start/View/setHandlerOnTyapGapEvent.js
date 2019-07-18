import TypeStyle from './TypeStyle'
import * as lineHeight from './lineHeight'

export default function(editor, annotationData, typeGap, typeDefinition, annotationPosition) {
  const setTypeStyle = (newValue) => editor.find('.textae-editor__type').css(new TypeStyle(newValue))

  typeGap(setTypeStyle)
  typeGap((newValue) => lineHeight.setToTypeGap(editor[0], annotationData, typeDefinition, newValue))
  typeGap((newValue) => annotationPosition.update(newValue))
}
