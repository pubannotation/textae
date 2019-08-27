import CompositeCommand from './CompositeCommand'
import getSpecificModification from './getSpecificModification'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    modificationType,
    typeEditor
  ) {
    super()

    this.id = typeEditor.getSelectedIdEditable()
    this.subCommands = this.id
      .filter(
        (id) =>
          !getSpecificModification(annotationData, id, modificationType)
            .length > 0
      )
      .map(
        (id) =>
          new CreateCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            false,
            {
              obj: id,
              pred: modificationType
            }
          )
      )
  }

  execute() {
    super.execute('modification', 'attach', this.id, this.subCommands)
  }
}
