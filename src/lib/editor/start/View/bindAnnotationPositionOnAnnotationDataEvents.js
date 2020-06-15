import debounce from 'debounce'

export default function(editor, annotationPosition, typeGap) {
  const debouncedUpdateAnnotationPosition = debounce(
    () => annotationPosition.updateAsync(typeGap()),
    100
  )
  editor.eventEmitter
    .on('textae.annotationData.all.change', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.add', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.change', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.remove', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.entity.move', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.relation.add', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.attribute.add', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.attribute.change', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.attribute.remove', () => {
      debouncedUpdateAnnotationPosition()
    })
    .on('textae.annotationData.span.move', () => {
      // Move grids and relations synchronously.
      // If grid and relations move asynchronously,
      // grid positions in cache may be deleted before render relation when moving span frequently.
      // Position of relation depends on position of grid and position of grid is cached for perfermance.
      // If position of grid is not cached, relation can not be rendered.
      annotationPosition.update(typeGap())
    })
}
