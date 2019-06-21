export default function(relations) {
  // Render relations unless rendered.
  return Promise.all(relations
    .filter((connect) => connect.render)
    .map((connect) => connect.render()))
}
