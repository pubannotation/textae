import EditDialog from '../dialog/EditDialog'

export default class extends EditDialog {

  constructor(editor, typeContainer, done, autocompletionWs) {
    super(editor, 'Predicate', 'Value', typeContainer, done, autocompletionWs)
  }
}
