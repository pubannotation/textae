import delegate from 'delegate'
import getEntityHtmlelementFromChild from '../getEntityHtmlelementFromChild'

export default function (editor, hoverRelation) {
  const dom = editor[0]

  // Highlight retaitons when related entity is heverd.
  delegate(dom, '.textae-editor__entity__endpoint', 'mouseover', (e) =>
    hoverRelation.on(getEntityHtmlelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__type-values', 'mouseover', (e) =>
    hoverRelation.on(getEntityHtmlelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__endpoint', 'mouseout', (e) =>
    hoverRelation.off(getEntityHtmlelementFromChild(e.target).title)
  )
  delegate(dom, '.textae-editor__entity__type-values', 'mouseout', (e) =>
    hoverRelation.off(getEntityHtmlelementFromChild(e.target).title)
  )
}
