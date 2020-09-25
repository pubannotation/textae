import Connect from '../Connect'

export default function reselectAll(editor, relations) {
  relations
    .map((relation) => new Connect(editor, relation.id))
    .forEach((connect) => connect.select())
}
