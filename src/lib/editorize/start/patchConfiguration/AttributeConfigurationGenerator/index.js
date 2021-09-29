import fillInferDefinitionFormAnnotation from './fillInferDefinitionFormAnnotation'
import fillDefaultValueOfSelectionAttributes from './fillDefaultValueOfSelectionAttributes'
import fillMandatoryValueOfNumericAttributes from './fillMandatoryValueOfNumericAttributes'

export default class AttributeConfigurationGenerator {
  constructor(config = [], annotations = []) {
    this._annotations = annotations
    this._config = config
  }

  get configuration() {
    let newConfig = fillInferDefinitionFormAnnotation(
      this._config,
      this._annotations
    )

    newConfig = fillMandatoryValueOfNumericAttributes(newConfig)

    return fillDefaultValueOfSelectionAttributes(newConfig, this._annotations)
  }
}
