/**
 * Convert the editor object to an object that can be used from the outside.
 * @param {import('../Editor').default} editor
 */
export default function toAPI(editor) {
  return {
    // We plan to add information here that we would like to make available to the outside world.
    set annotation(annotation) {
      editor.load(annotation)
    },
    set inspectCallback(callback) {
      editor.setInspector(callback)
    }
  }
}
