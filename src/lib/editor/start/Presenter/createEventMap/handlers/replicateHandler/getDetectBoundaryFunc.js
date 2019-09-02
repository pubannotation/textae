export default function(pushButtons, spanConfig) {
  if (pushButtons.getButton('boundary-detection').value()) {
    return spanConfig.isDelimiter
  } else {
    return null
  }
}
