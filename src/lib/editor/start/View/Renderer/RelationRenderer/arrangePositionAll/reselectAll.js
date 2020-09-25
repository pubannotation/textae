export default function(relations) {
  relations
    .map((relation) => relation.connect)
    .forEach((connect) => connect.select())
}
