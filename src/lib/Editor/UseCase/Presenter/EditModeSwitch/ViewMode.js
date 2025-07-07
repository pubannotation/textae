import EditMode from './EditMode'

export default class ViewMode extends EditMode {
  get selectedText() {
    // This is a dummy implementation.
    return {
      begin: 0,
      end: 100,
      status: 'selected'
    }
  }
}
