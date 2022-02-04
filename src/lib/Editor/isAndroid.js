export default function () {
  // For development environments, Use the navigator.userAgent.
  // Because the navigator.userAgentData only work in the secure context(HTTPS).
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
  return /Android/.test(navigator.userAgent)
}
