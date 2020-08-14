export default function(entity, cssClass) {
  const typeDom = entity.closest('.textae-editor__type')

  return (
    typeDom.querySelectorAll('.textae-editor__entity').length ===
    typeDom.querySelectorAll(`.textae-editor__entity.${cssClass}`).length
  )
}
