import getEntityHtmlelementFromChild from '../getEntityHtmlelementFromChild'

export default function (el) {
  return getEntityHtmlelementFromChild(el).querySelector(
    '.textae-editor__entity__type-values'
  )
}
