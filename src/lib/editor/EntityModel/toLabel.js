export default function (href, label) {
  return href
    ? `
        <a target="_blank"/ href="${href}">${label}</a>
        `
    : label
}
