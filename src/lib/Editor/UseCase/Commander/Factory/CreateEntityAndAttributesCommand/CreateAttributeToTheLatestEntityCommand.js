import { CreateCommand } from '../commandTemplate'

export default class CreateAttributeToTheLatestEntityCommand extends CreateCommand {
  constructor(annotationModel, obj, pred) {
    super(annotationModel, 'attribute', {
      obj,
      pred
    })
  }

  execute() {
    const subj = this._annotationModel.entity.all.pop().id
    this._instance.subj = subj
    return super.execute()
  }
}
