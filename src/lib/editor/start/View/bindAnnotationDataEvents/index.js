import debounce from 'debounce'
import LineHeightAuto from './LineHeightAuto'

export default function (editor, annotationPosition, textBox) {
  const lineHeightAuto = new LineHeightAuto(editor, textBox)
  const debouncedUpdatePosition = debounce(() => {
    lineHeightAuto.updateLineHeight()
    annotationPosition.update()
  }, 100)

  editor.eventEmitter
    .on('textae-event.annotationData.all.change', debouncedUpdatePosition)
    .on('textae-event.annotationData.entity.add', debouncedUpdatePosition)
    .on('textae-event.annotationData.entity.change', debouncedUpdatePosition)
    .on('textae-event.annotationData.entity.remove', debouncedUpdatePosition)
    .on('textae-event.annotationData.entity.move', debouncedUpdatePosition)
    .on('textae-event.annotationData.relation.add', debouncedUpdatePosition)
    .on('textae-event.annotationData.attribute.add', debouncedUpdatePosition)
    .on('textae-event.annotationData.attribute.change', debouncedUpdatePosition)
    .on('textae-event.annotationData.attribute.remove', debouncedUpdatePosition)
    .on('textae-event.annotationData.span.move', () => {
      // Move grids and relations synchronously.
      // If grid and relations move asynchronously,
      // grid positions in cache may be deleted before render relation when moving span frequently.
      // Position of relation depends on position of grid and position of grid is cached for perfermance.
      // If position of grid is not cached, relation can not be rendered.
      annotationPosition.update()
    })
}
