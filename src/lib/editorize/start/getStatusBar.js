import StatusBar from '../../component/StatusBar'

export default function (editor, parameterValue) {
  if (parameterValue === 'on') return new StatusBar(editor)
  return {
    status() {}
  }
}
