import reflectTypeGapInTheHeight from '../reflectTypeGapInTheHeight'

export default function(editor, newValue) {
  for (const el of editor[0].querySelectorAll('.textae-editor__entity-pane')) {
    reflectTypeGapInTheHeight(el, newValue)
  }
}
