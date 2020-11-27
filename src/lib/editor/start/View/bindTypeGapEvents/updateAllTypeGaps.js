import reflectTypeGapInTheHeight from '../reflectTypeGapInTheHeight'

export default function (annotationData, newValue) {
  for (const { element } of annotationData.entity.denotations) {
    reflectTypeGapInTheHeight(element, newValue)
  }
}
