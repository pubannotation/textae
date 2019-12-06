export default function(editMode) {
  return {
    toViewMode: () => editMode.pushView(),
    toTermMode: () => editMode.pushTerm(),
    toRelationMode: () => editMode.pushRelation()
  }
}
