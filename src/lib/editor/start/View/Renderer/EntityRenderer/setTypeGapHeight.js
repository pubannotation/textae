import getTypeDom from '../getTypeDom'
import reflectTypeGapInTheHeight from '../../reflectTypeGapInTheHeight'

export default function(entity, typeGap) {
  const dom = getTypeDom(entity)
  if (dom) {
    reflectTypeGapInTheHeight(
      dom.querySelector('.textae-editor__type-gap'),
      typeGap()
    )
  }
}
