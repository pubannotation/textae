import getTypeDomOfEntityDom from '../getTypeDomOfEntityDom'

export default function(el) {
  return getTypeDomOfEntityDom(el).querySelector('.textae-editor__type-values')
}
