import getTypeGapHeightStyle from '../../getTypeGapHeightStyle'
import getTypeDom from '../getTypeDom'

export default function(entity, typeGap) {
  const dom = getTypeDom(entity)
  if (dom) {
    dom.querySelector('.textae-editor__type-gap').setAttribute('style', getTypeGapHeightStyle(typeGap()))
  }
}
