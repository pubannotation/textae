export default function (buttonGroup) {
  return buttonGroup.map((list) => {
    const ret = []
    for (const { type, title, pushed, disabled, transit } of list) {
      const classList = ['textae-control-icon', `textae-control-${type}-button`]
      if (pushed) {
        classList.push('textae-control-icon--pushed')
      }
      if (disabled) {
        classList.push('textae-control-icon--disabled')
      }
      if (transit) {
        classList.push('textae-control-icon--transit')
      }

      ret.push({ type, title, classList })
    }

    return ret
  })
}
