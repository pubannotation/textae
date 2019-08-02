import CompositeCommand from './CompositeCommand'
import getSpecificModification from './getSpecificModification'
import { RemoveCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(
    editor,
    selectionModel,
    annotationData,
    modificationType,
    typeEditor
  ) {
    super()

    this.id = typeEditor.getSelectedIdEditable()
    this.subCommands = this.id
      .map(
        (id) => getSpecificModification(annotationData, id, modificationType)[0]
      )
      .map(
        (m) =>
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            m.id
          )
      )
  }

  execute() {
    super.execute('modification', 'remove', this.id, this.subCommands)
  }
}
