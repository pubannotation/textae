import getTypeGapHeightStyle from '../lineHeight/getTypeGapHeightStyle'

export default function(editor, newValue) {
  for (const el of editor[0].querySelectorAll('.textae-editor__type-gap')) {
    el.setAttribute('style', getTypeGapHeightStyle(newValue))
  }
}
