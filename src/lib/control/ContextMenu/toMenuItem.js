export default function ({ type, title }) {
  return `
  <p 
    class="textae-control-icon textae-control-${type}-button" 
    data-button-type="${type}">${title}
  </p>`
}
