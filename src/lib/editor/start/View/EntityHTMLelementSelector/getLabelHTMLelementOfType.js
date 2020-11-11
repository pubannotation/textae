import getEntityHTMLelementFromChild from '../../getEntityHTMLelementFromChild'

export default function (elementInEntityHtmlelement) {
  return getEntityHTMLelementFromChild(
    elementInEntityHtmlelement
  ).querySelector('.textae-editor__entity__type-label')
}
