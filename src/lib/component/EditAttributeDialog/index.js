import EditDialog from '../dialog/EditDialog'

export default class extends EditDialog {
   constructor(editor, done) {
    super(editor, 'Predicate', 'Value', done, null)
  }
}
