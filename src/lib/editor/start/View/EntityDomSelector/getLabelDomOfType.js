import getTypeDomOfEntityDom from '../../getTypeDomOfEntityDom'

export default function(elementInTypeDom) {
  return getTypeDomOfEntityDom(elementInTypeDom).querySelector(
    '.textae-editor__type-label'
  )
}
