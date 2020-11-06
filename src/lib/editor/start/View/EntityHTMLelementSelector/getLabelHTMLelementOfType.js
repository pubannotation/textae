import getEntityHtmlelementFromChild from '../../getEntityHtmlelementFromChild'

export default function (elementInEntityHtmlelement) {
  return getEntityHtmlelementFromChild(
    elementInEntityHtmlelement
  ).querySelector('.textae-editor__entity__type-label')
}
