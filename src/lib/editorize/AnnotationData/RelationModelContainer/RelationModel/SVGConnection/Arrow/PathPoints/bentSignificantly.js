export default function (source, target) {
  if (source.y < target.y) {
    return {
      sourceControlX: source.x,
      targetControlX: target.x + (source.x <= target.x + 16 ? 150 : -150)
    }
  } else {
    return {
      sourceControlX: source.x + (source.x <= target.x + 16 ? 150 : -150),
      targetControlX: target.x
    }
  }
}
