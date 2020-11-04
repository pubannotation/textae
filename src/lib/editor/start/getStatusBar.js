import StatusBar from '../../component/StatusBar'

export default function (editor, statusBar) {
  if (statusBar === 'on') return new StatusBar(editor)
  return {
    status() {}
  }
}
