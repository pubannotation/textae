import getEntityHTMLelementFromChild from '../getEntityHTMLelementFromChild'

export default function (el) {
  return getEntityHTMLelementFromChild(el).querySelector(
    '.textae-editor__entity__type-values'
  )
}
