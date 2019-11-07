import ChangeAttributeCommand from '../ChangeAttributeCommand'

export default function(annotationData, oldPred, newPred) {
  return annotationData.attribute.all
    .filter((attr) => attr.pred === oldPred)
    .map((attribute) => {
      return new ChangeAttributeCommand(
        annotationData,
        attribute,
        newPred,
        attribute.obj
      )
    })
}
