import anemone from '../anemone'

export default function inputAutocomletionWs(
  componentClassName,
  autocompletionWs
) {
  return () => anemone`
  <div class="${componentClassName}__row">
    <label>Autocompletion_ws</label>
    <input
      value="${autocompletionWs || ''}"
      class="${componentClassName}__autocompletion-ws"
    >
  </div>
  `
}
