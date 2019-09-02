import deleteButtonClicked from './deleteButtonClicked'
import editButtonClicked from './editButtonClicked'

export default function(editor, selectionModel, commander) {
  editor
    .on('click', '.textae-editor__attribute-button--edit', (e) =>
      editButtonClicked(editor, selectionModel, commander, e)
    )
    .on('click', '.textae-editor__attribute-button--delete', (e) =>
      deleteButtonClicked(selectionModel, commander, e)
    )
}
