export default function(selectionModel, hasCopy, eOrR) {
  return new Map([
    ['replicate', () => Boolean(selectionModel.span.single())],
    ['entity', () => selectionModel.span.some],
    ['delete', () => selectionModel.some],
    ['copy', () => selectionModel.span.some || selectionModel.entity.some],
    ['paste', () => hasCopy() && selectionModel.span.some],
    ['change-label', eOrR],
    ['negation', eOrR],
    ['speculation', eOrR]
  ])
}
