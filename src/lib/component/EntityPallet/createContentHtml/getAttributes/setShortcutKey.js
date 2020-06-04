export default function(attributes) {
  return attributes.map((a, index) => {
    if (index < 9) {
      a.shortcutKey = index + 1
    }
    return a
  })
}
