import getAnnotationBox from '../../../getAnnotationBox'

export default function(editor, span) {
  const div = document.createElement('div')
  div.setAttribute('id', span.backgroundId)
  div.classList.add('textae-editor__block-bg')
  div.dataset.id = span.id

  // Place the background in the annotation box
  // to shift the background up by half a line from the block span area.
  getAnnotationBox(editor)[0].appendChild(div)
}
