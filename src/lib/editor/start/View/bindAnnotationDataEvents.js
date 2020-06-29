import debounce from 'debounce'

export default function(editor, annotationPosition) {
  const debouncedUpdatePosition = debounce(
    () => annotationPosition.updateAsync(),
    100
  )
  editor.eventEmitter
    .on('textae.annotationData.all.change', debouncedUpdatePosition)
    .on('textae.annotationData.entity.add', debouncedUpdatePosition)
    .on('textae.annotationData.entity.change', debouncedUpdatePosition)
    .on('textae.annotationData.entity.remove', debouncedUpdatePosition)
    .on('textae.annotationData.entity.move', debouncedUpdatePosition)
    .on('textae.annotationData.relation.add', debouncedUpdatePosition)
    .on('textae.annotationData.attribute.add', debouncedUpdatePosition)
    .on('textae.annotationData.attribute.change', debouncedUpdatePosition)
    .on('textae.annotationData.attribute.remove', debouncedUpdatePosition)
    .on('textae.annotationData.span.move', () => {
      // Move grids and relations synchronously.
      // If grid and relations move asynchronously,
      // grid positions in cache may be deleted before render relation when moving span frequently.
      // Position of relation depends on position of grid and position of grid is cached for perfermance.
      // If position of grid is not cached, relation can not be rendered.
      annotationPosition.update()
    })
}
