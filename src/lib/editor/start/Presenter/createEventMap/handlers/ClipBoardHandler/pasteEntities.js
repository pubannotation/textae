// Make commands per selected spans from types in clipBoard.
export default function(selectionModel, clipBoard, command) {
  const commands = selectionModel.span
    .all()
    .map((span) =>
      clipBoard.clipBoard.map((type) =>
        command.factory.entityCreateCommand({
          span,
          type
        })
      )
    )
    .flat()

  command.invoke(commands)
}
