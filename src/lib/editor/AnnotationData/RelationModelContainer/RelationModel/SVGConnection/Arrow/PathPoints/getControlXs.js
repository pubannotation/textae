// When the source endpoint and target endpoint are close, bent the relationship significantly.
export default function (
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceEntityBottom,
  targetEntityBottom
) {
  if (
    Math.abs(sourceEntityBottom - targetEntityBottom) < 12 ||
    42 < Math.abs(targetX - sourceX)
  ) {
    return { sourceControlX: sourceX, targetControlX: targetX }
  }

  return bentSignificantly(sourceX, sourceY, targetX, targetY)
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
