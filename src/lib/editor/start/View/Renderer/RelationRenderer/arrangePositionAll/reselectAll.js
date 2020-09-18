import Connect from '../Connect'
export default function reselectAll(editor, annotationData, relations) {
  relations
    .map((relation) => new Connect(editor, annotationData, relation.id))
    .forEach((connect) => connect.select())
}
