// Make commands per selected spans from types in clipBoard.
export default function(selectionModel, clipBoard, command) {
  const commands = selectionModel.span
    .all()
    .map((spanId) => {
      return clipBoard.clipBoard.map((type) => {
        return command.factory.entityCreateCommand({
          span: spanId,
          type
        })
      })
    })
    .flat()
  command.invoke(commands, ['annotation'])
}
