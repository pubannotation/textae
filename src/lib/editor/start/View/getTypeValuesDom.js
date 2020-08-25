import getEntityDomFromChild from '../getEntityDomFromChild'

export default function(el) {
  return getEntityDomFromChild(el).querySelector(
    '.textae-editor__entity__type-values'
  )
}
