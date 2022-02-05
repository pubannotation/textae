import fillInferDefinitionFromAnnotation from './fillInferDefinitionFromAnnotation'
import fillDefaultValueOfSelectionAttributes from './fillDefaultValueOfSelectionAttributes'
import fillMandatoryValueOfNumericAttributes from './fillMandatoryValueOfNumericAttributes'
import fillDefaultValueOfStringAttributes from './fillDefaultValueOfStringAttributes'

export default class AttributeConfigurationGenerator {
  constructor(config = [], annotations = []) {
    this._annotations = annotations
    this._config = config
  }

  get configuration() {
    let newConfig = fillInferDefinitionFromAnnotation(
      this._config,
      this._annotations
    )
    newConfig = fillMandatoryValueOfNumericAttributes(newConfig)
    newConfig = fillDefaultValueOfStringAttributes(newConfig)
    newConfig = fillDefaultValueOfSelectionAttributes(
      newConfig,
      this._annotations
    )

    return newConfig
  }
}
