export default function (editor, callback) {
  editor.eventEmitter.on(
    'textae.entityAndAttributePallet.attribute.selection-attribute-label.click',
    (attrDef, newObj) => callback(attrDef, newObj)
  )
}
