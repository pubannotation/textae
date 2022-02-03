import StatusBar from '../../component/StatusBar'

export default function (editorHTMLElement, parameterValue) {
  return new StatusBar(editorHTMLElement, parameterValue === 'on')
}
