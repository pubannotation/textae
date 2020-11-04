import getEntityDomFromChild from '../../getEntityDomFromChild'

export default function (elementInEntityDom) {
  return getEntityDomFromChild(elementInEntityDom).querySelector(
    '.textae-editor__entity__type-label'
  )
}
