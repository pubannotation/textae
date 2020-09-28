export default function(relations) {
  for (const connect of relations) {
    connect.select()
  }
}
