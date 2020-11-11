import delegate from 'delegate'
import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'

export default function (editor, hoverRelation) {
  const dom = editor[0]

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity__endpoint', 'mouseover', (e) =>
    hoverRelation.on(getEntityHTMLelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__type-values', 'mouseover', (e) =>
    hoverRelation.on(getEntityHTMLelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__endpoint', 'mouseout', (e) =>
    hoverRelation.off(getEntityHTMLelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__type-values', 'mouseout', (e) =>
    hoverRelation.off(getEntityHTMLelementFromChild(e.target).title)
  )
}
