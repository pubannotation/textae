export default function(
  commander,
  subjectEntityId,
  objectEntityId,
  typeDefinition
) {
  commander.invoke(
    commander.factory.relationCreateCommand({
      subj: subjectEntityId,
      obj: objectEntityId,
      type: typeDefinition.relation.defaultType
    })
  )
}
