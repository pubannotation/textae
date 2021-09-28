export default function (source, target) {
  if (source.y < target.y) {
    return {
      sourceControlX: source.x,
      targetControlX: target.x + (source.anchor === 'right' ? 150 : -150)
    }
  } else {
    return {
      sourceControlX: source.x + (target.anchor === 'right' ? 150 : -150),
      targetControlX: target.x
    }
  }
}
