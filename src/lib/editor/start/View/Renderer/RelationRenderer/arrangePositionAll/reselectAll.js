import Connect from '../Connect'
export default function reselectAll(editor, annotationData, relationIds) {
  relationIds
    .map((relationId) => new Connect(editor, annotationData, relationId))
    .filter((connect) => connect instanceof jsPlumb.Connection)
    .forEach((connect) => connect.select())
}
