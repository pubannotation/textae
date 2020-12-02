export default function (annotationData, newValue) {
  for (const entity of annotationData.entity.denotations) {
    entity.reflectTypeGapInTheHeight(newValue)
  }
}
