import {
  EventEmitter
}
from 'events'
import createEntityToSpans from './createEntityToSpans'

export default function(command, selectionModel, entity, callback) {
  return function() {
    createEntityToSpans(
      command,
      selectionModel.span.all(),
      entity.getDefaultType()
    )

    callback()
  }
}