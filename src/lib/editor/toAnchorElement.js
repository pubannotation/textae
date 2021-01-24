import eskape from 'eskape'

export default function (displayName, href) {
  return href
    ? eskape`<a target="_blank" href="${href}">${displayName}</a>`
    : eskape`${displayName}`
}
