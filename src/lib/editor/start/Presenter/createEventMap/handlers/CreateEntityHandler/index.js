import createEntityToSpans from './createEntityToSpans'

export default function(command, selectionModel, entity, callback) {
  return () => {
    createEntityToSpans(
      command,
      selectionModel.span.all(),
      entity.getDefaultType()
    )

    callback()
  }
}
