import getEntityDom from '../getEntityDom'
import reflectTypeGapInTheHeight from '../../reflectTypeGapInTheHeight'

export default function(entity, typeGap) {
  const dom = getEntityDom(entity)
  if (dom) {
    reflectTypeGapInTheHeight(dom, typeGap())
  }
}
