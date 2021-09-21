import { CreateCommand } from '../commandTemplate'

export default class CreateAttributeToTheLatestEntityCommand extends CreateCommand {
  constructor(annotationData, obj, pred) {
    super(annotationData, 'attribute', {
      obj,
      pred
    })
  }

  execute() {
    const subj = this._annotationData.entity.all.pop().id
    this._model.subj = subj
    return super.execute()
  }
}
