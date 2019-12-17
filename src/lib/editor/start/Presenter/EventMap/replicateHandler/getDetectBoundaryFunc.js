export default function(pushButtons, spanConfig) {
  if (pushButtons.getButton('boundary-detection').value()) {
    return (char) => spanConfig.isDelimiter(char)
  } else {
    return null
  }
}
