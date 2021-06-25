export default function () {
  return ({ type, title }) => `
  <p 
    class="textae-control-icon textae-control-${type}-button" 
    data-button-type="${type}">${title}
  </p>`
}
