import { CreateCommand } from './commandTemplate'
import idFactory from '../../../idFactory'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, span, types) {
    super()
    const spanCreateCommand = (span) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'span',
        true,
        span
      )
    const entityCreateCommand = (entity) =>
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        true,
        entity
      )
    const id = idFactory.makeSpanId(editor, span)
    const createSpan = spanCreateCommand(span)
    const createEntities = types.map((type) =>
      entityCreateCommand({
        span: id,
        type
      })
    )
    this.subCommands = [createSpan].concat(createEntities)
    this.id = id
  }

  execute() {
    super.execute('span', 'create', this.id, this.subCommands)
  }
}
