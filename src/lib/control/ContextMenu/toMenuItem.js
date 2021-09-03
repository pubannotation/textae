export default function (type, title, isPushed, isEnabled) {
  return `
  <p 
    class="textae-control-icon textae-control-${type}-button${
    isPushed ? ' textae-control-icon--pushed' : ''
  }${isEnabled ? '' : ' textae-control-icon--disabled'}" 
    data-button-type="${type}">${title}
  </p>`
}
