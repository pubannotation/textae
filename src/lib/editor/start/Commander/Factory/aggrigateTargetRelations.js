export default function (targetRelations, targetAttributes, relation) {
  targetRelations.add(relation)
  for (const attribute of relation.attributes) {
    targetAttributes.add(attribute)
  }
}
