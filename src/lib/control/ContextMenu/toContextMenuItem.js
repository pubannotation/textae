export default function ({ type, title, classList }) {
  return `<p 
    class="${classList.join(' ')}"  
    data-button-type="${type}">${title}
  </p>`
}
