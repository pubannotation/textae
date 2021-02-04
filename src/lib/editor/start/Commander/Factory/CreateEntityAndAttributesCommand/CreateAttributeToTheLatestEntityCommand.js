import { CreateCommand } from '../commandTemplate'

export default class CreateAttributeToTheLatestEntityCommand extends CreateCommand {
  constructor(editor, annotationData, obj, pred) {
    super(editor, annotationData, 'attribute', {
      obj,
      pred
    })
  }

  execute() {
    const subj = this._annotationData.entity.all.pop().id
    this._newModel.subj = subj
    return super.execute()
  }
}
