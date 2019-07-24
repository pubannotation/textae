export default class DialogParams {
  constructor(
    editedAnnotation,
    originalConfig,
    editedConfig,
    hasAnythingToSaveAnnotation,
    hasAnythingToSaveConfiguration
  ) {
    this.editedAnnotation = editedAnnotation
    this.originalConfig = originalConfig
    this.editedConfig = editedConfig
    this.hasAnythingToSaveAnnotation = hasAnythingToSaveAnnotation
    this.hasAnythingToSaveConfiguration = hasAnythingToSaveConfiguration
  }
}
