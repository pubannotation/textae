import setVeilObserver from './setVeilObserver'

export default function(container, editor) {
  container.push(editor)
  setVeilObserver(editor[0])
}
