import aggrigateTargetRelations from './aggrigateTargetRelations'

export default function (
  targetEntities,
  targetRelations,
  targetAttributes,
  entity
) {
  targetEntities.add(entity)
  for (const attribute of entity.attributes) {
    targetAttributes.add(attribute)
  }
  for (const relation of entity.relations) {
    aggrigateTargetRelations(targetRelations, targetAttributes, relation)
  }
}
