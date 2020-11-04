export default function (title, content) {
  const el = document.createElement('div')
  el.title = title
  el.innerHTML = content

  return el
}
