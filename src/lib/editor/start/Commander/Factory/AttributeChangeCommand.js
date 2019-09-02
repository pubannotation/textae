import AnnotationCommand from './AnnotationCommand'

export default class AttributeChangeCommand extends AnnotationCommand {
  constructor(annotationData, attribute, newPred, newObj) {
    super()
    this.annotationData = annotationData
    this.attribute = attribute
    this.oldPred = attribute.pred
    this.oldObj = attribute.obj
    this.newPred = newPred
    this.newObj = newObj
  }

  execute() {
    this.newModel = this.annotationData.attribute.change(
      this.attribute.id,
      this.newPred,
      this.newObj
    )
  }

  revert() {
    return new AttributeChangeCommand(
      this.annotationData,
      this.newModel,
      this.oldPred,
      this.oldObj
    )
  }
}
