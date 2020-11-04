export default function (annotationData) {
  return annotationData.entity.denotations.map((entity) => ({
    id: entity.id,
    span: {
      begin: entity.span.begin,
      end: entity.span.end
    },
    obj: entity.typeName
  }))
}
