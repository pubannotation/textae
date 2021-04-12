export default function (sourceX, sourceY, targetX, targetY) {
  if (targetY === sourceY || Math.abs(targetX - sourceX) > 42) {
    return { sourceControlX: sourceX, targetControlX: targetX }
  }

  if (sourceY < targetY) {
    const sourceControlX = sourceX

    // When the source endpoint and target endpoint are close,
    // bend the target endpoint side of the relationship significantly.
    const targetControlX = targetX + (sourceX <= targetX + 16 ? 150 : -150)

    return { sourceControlX, targetControlX }
  } else {
    const sourceControlX = sourceX + (sourceX <= targetX + 16 ? 150 : -150)

    const targetControlX = targetX

    return { sourceControlX, targetControlX }
  }
}
