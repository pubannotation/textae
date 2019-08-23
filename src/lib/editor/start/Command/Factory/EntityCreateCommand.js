import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, spanId, typeName) {
    super()
    this.id = spanId
    this.subCommands = [
      new CreateCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        true,
        {
          span: spanId,
          type: typeName
        }
      )
    ]
  }
  execute() {
    super.execute('type for span', 'create', this.id, this.subCommands)
  }
}
