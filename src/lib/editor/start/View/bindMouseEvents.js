import delegate from 'delegate'

export default function(editor, hoverRelation) {
  const dom = editor[0]

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity', 'mouseover', (e) =>
    hoverRelation.on(e.target.title)
  )
  delegate(dom, '.textae-editor__entity', 'mouseout', (e) =>
    hoverRelation.off(e.target.title)
  )
}
