import reflectTypeGapInTheHeight from '../reflectTypeGapInTheHeight'

export default function (annotationData, newValue) {
  for (const { element } of annotationData.entity.all) {
    reflectTypeGapInTheHeight(element, newValue)
  }
}
