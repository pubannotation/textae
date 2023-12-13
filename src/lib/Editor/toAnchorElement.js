import anemone from '../component/anemone'

export default function (displayName, href) {
  return () =>
    href
      ? anemone`<a target="_blank" href="${href}">${displayName}</a>`
      : anemone`${displayName}`
}
