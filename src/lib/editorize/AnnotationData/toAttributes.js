export default function (annotationData) {
  return annotationData.attribute.all.map(({ JSON }) => JSON)
}
