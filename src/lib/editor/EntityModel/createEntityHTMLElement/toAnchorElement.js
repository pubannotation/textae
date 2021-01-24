import eskape from 'eskape'

export default function (label, href) {
  return href
    ? eskape`<a target="_blank" href="${href}">${label}</a>`
    : eskape`${label}`
}
