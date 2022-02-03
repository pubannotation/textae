import StatusBar from '../../component/StatusBar'

export default function (editorHTMLElement, parameterValue) {
  if (parameterValue === 'on') return new StatusBar(editorHTMLElement)
  return {
    status() {}
  }
}
