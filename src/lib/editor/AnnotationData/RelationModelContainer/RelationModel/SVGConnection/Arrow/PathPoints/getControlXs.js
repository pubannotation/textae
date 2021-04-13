// When the source endpoint and target endpoint are close, bent the relationship significantly.
export default function (sourceX, sourceY, targetX, targetY) {
  if (targetY === sourceY || Math.abs(targetX - sourceX) > 42) {
    return { sourceControlX: sourceX, targetControlX: targetX }
  }

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
