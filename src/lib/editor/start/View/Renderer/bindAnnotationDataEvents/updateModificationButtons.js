export default function(annotationData, modification, buttonStateHelper) {
  if (annotationData.entity.get(modification.obj)) {
    buttonStateHelper[`updateByEntity`]()
  } else if (annotationData.relation.get(modification.obj)) {
    buttonStateHelper[`updateByRelation`]()
  }
}
