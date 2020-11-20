export default function (color) {
  const c = color.slice(1)
  const r = parseInt(c.substr(0, 2), 16)
  const g = parseInt(c.substr(2, 2), 16)
  const b = parseInt(c.substr(4, 2), 16)

  return `rgba(${r}, ${g}, ${b}, 1)`
}
