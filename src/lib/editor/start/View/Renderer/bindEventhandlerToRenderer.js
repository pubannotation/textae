import debounce from 'debounce'
import updateTextBoxHeight from '../updateTextBoxHeight'
import setLineHeightToTypeGap from '../setLineHeightToTypeGap'

export default function(
  renderer,
  editor,
  annotationData,
  typeDefinition,
  typeGap,
  annotationPosition
) {
  const debouncedUpdateAnnotationPosition = debounce(
    () => annotationPosition.updateAsync(typeGap()),
    100
  )
  renderer
    .on('change', debouncedUpdateAnnotationPosition)
    .on('all.change', () => {
      updateTextBoxHeight(editor[0])
      setLineHeightToTypeGap(
        editor[0],
        annotationData,
        typeDefinition,
        typeGap()
      )
      debouncedUpdateAnnotationPosition()
    })
    .on('span.add', debouncedUpdateAnnotationPosition)
    .on('span.move', () => {
      // Move grids and relations synchronously.
      // If grid and relations move asynchronously,
      // grid positions in cache may be deleted before render relation when moving span frequently.
      // Position of relation depends on position of grid and position of grid is cached for perfermance.
      // If position of grid is not cached, relation can not be rendered.
      annotationPosition.update(typeGap())
    })
    .on('span.remove', debouncedUpdateAnnotationPosition)
    .on('entity.add', debouncedUpdateAnnotationPosition)
    .on('entity.change', debouncedUpdateAnnotationPosition)
    .on('entity.remove', debouncedUpdateAnnotationPosition)
    .on('attribute.add', debouncedUpdateAnnotationPosition)
    .on('attribute.remove', debouncedUpdateAnnotationPosition)
    .on('relation.add', debouncedUpdateAnnotationPosition)
}
