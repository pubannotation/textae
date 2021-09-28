// When the source endpoint and target endpoint are close, bent the relationship significantly.
export default function (
  source,
  target,
  sourceEntityBottom,
  targetEntityBottom
) {
  if (
    Math.abs(sourceEntityBottom - targetEntityBottom) < 12 ||
    42 < Math.abs(target.x - source.x)
  ) {
    return { sourceControlX: source.x, targetControlX: target.x }
  }

  return bentSignificantly(source, target)
}

function bentSignificantly(source, target) {
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
