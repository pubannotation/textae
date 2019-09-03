import html from './html'

export default function(container) {
  const area = container.querySelector('.textae-editor__footer__message')

  if (area) {
    return area
  }

  container.insertAdjacentHTML('beforeend', html)
  return container.querySelector('.textae-editor__footer__message')
}
