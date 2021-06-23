export default function () {
  return ({ type, title }) => `
  <p 
    class="textae-control__icon textae-control__${type}-button" 
    data-button-type="${type}">${title}
  </p>`
}
