import { CreateCommand } from '../commandTemplate'

export default function(
  entities,
  newAttributes,
  annotationData,
  editor,
  selectionModel
) {
  return entities.reduce(
    (commands, subj) =>
      commands.concat(
        newAttributes
          .filter(
            // Exclude attributes that don't change.
            (newA) =>
              !annotationData.entity
                .get(subj)
                .attributes.some(
                  (oldA) => newA.pred === oldA.pred && newA.obj === oldA.obj
                )
          )
          .map(
            ({ obj, pred }) =>
              new CreateCommand(
                editor,
                annotationData,
                selectionModel,
                'attribute',
                true,
                {
                  subj,
                  obj,
                  pred
                }
              )
          )
      ),
    []
  )
}
