export default function (params, editor, name) {
  if (editor.getAttribute(name)) {
    params.set(name, editor.getAttribute(name))
  }
}
