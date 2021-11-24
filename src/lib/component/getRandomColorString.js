export default function () {
  return `#${Math.floor(Math.random() * 150 + 100).toString(16)}${Math.floor(
    Math.random() * 150 + 100
  ).toString(16)}${Math.floor(Math.random() * 150 + 100).toString(16)}`
}
