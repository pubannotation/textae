import { HEIGHT } from '../../editorize/AttributeDefinitionContainer/createAttributeDefinition/MediaAttributeDefinition'

export default function (componentClassName, height) {
  return `
    <div class="${componentClassName}__row">
      <label>Hight</label>
      <input
        type="text"
        value="${height || HEIGHT}"
        class="${componentClassName}__height"
      >
    </div>
  `
}
