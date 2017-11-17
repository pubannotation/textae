export default class DialogParams {
  constructor(editedAnnotation, originalConfig, editedConfig, hasAnythingToSave) {
    this.editedAnnotation = editedAnnotation
    this.originalConfig = originalConfig
    this.editedConfig = editedConfig
    this.hasAnythingToSave = hasAnythingToSave
  }
}
