import getTypeDomOfEntityDom from '../getTypeDomOfEntityDom'

export default function(entity, cssClass) {
  const typeDom = getTypeDomOfEntityDom(entity)

  return (
    typeDom.querySelectorAll('.textae-editor__entity').length ===
    typeDom.querySelectorAll(`.textae-editor__entity.${cssClass}`).length
  )
}
