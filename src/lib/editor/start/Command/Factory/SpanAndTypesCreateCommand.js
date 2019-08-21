import { CreateCommand } from './commandTemplate'
import idFactory from '../../../idFactory'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newSpan, types) {
    super()
    const spanId = idFactory.makeSpanId(editor, newSpan)

    this.subCommands = [
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'span',
        true,
        newSpan
      )
    ].concat(
      types.map((type) =>
        typeCreateCommand(
          editor,
          annotationData,
          selectionModel,
          spanId,
          type.name
        )
      )
    )
    this.id = spanId
  }

  execute() {
    super.execute('span', 'create', this.id, this.subCommands)
  }
}

function typeCreateCommand(editor, annotationData, selectionModel, span, type) {
  return new CreateCommand(
    editor,
    annotationData,
    selectionModel,
    'entity',
    true,
    {
      span,
      type
    }
  )
}
