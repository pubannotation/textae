export default function (
  commander,
  subjectEntityId,
  objectEntityId,
  typeDefinition
) {
  commander.invoke(
    commander.factory.createRelationCommand({
      subj: subjectEntityId,
      obj: objectEntityId,
      pred: typeDefinition.relation.defaultType
    })
  )
}
