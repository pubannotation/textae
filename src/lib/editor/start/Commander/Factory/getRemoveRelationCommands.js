import { RemoveCommand } from './commandTemplate'

export default function(
  entitiesWithChange,
  annotationData,
  editor,
  selectionModel
) {
  return entitiesWithChange
    .map((id) =>
      annotationData.entity
        .assosicatedRelations(id)
        .map(
          (id) =>
            new RemoveCommand(
              editor,
              annotationData,
              selectionModel,
              'relation',
              id
            )
        )
    )
    .flat()
}
