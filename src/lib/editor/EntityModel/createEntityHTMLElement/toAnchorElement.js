import eskape from 'eskape'

export default function (href, label) {
  return href
    ? eskape`<a target="_blank" href="${href}">${label}</a>`
    : eskape`${label}`
}
