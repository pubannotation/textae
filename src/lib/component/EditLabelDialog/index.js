import EditDialog from '../dialog/EditDialog'

export default class extends EditDialog {

  constructor(editor, typeDefinition, done, autocompletionWs) {
    super(editor, 'Predicate', 'Value', done, typeDefinition, autocompletionWs)
    const disableInput = this.$dialog.find('input').eq(0)
    disableInput.prop('disabled', true)
    disableInput.attr('disabled', 'disabled')
  }
}
