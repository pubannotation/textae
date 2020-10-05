export default function(annotationData) {
  return annotationData.entity.all.map((entity) => ({
    id: entity.id,
    span: {
      begin: entity.span.begin,
      end: entity.span.end
    },
    obj: entity.typeName
  }))
}
