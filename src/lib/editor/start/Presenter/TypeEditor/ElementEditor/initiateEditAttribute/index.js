import deleteButtonClicked from './deleteButtonClicked'
import editButtonClicked from './editButtonClicked'

export default function(editor, annotationData, selectionModel, command) {
  editor
    .on('click', '.textae-editor__attribute-button--edit', (e) => editButtonClicked(editor, selectionModel, command, e))
    .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(selectionModel, command, e))
}
