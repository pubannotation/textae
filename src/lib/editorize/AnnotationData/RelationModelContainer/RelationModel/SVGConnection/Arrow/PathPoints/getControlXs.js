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

  return bentSignificantly(source.x, source.y, target.x, target.y)
}

function bentSignificantly(sourceX, sourceY, targetX, targetY) {
  if (sourceY < targetY) {
    return {
      sourceControlX: sourceX,
      targetControlX: targetX + (sourceX <= targetX + 16 ? 150 : -150)
    }
  } else {
    return {
      sourceControlX: sourceX + (sourceX <= targetX + 16 ? 150 : -150),
      targetControlX: targetX
    }
  }
}
