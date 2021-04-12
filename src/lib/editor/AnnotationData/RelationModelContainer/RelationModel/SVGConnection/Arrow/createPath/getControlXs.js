export default function (sourceX, sourceY, targetX, targetY) {
  const sourceControlX = sourceX

  // When the source endpoint and target endpoint are close,
  // bend the target endpoint side of the relationship significantly.
  const targetControlX =
    targetX +
    (targetY === sourceY || Math.abs(targetX - sourceX) > 42
      ? 0
      : sourceX <= targetX + 16
      ? 150
      : -150)

  return { sourceControlX, targetControlX }
}
