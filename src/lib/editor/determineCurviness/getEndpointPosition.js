export default function (endpoint) {
  const gridStyle = endpoint.closest('.textae-editor__grid').style

  return {
    top: parseFloat(gridStyle.top) + endpoint.offsetTop,
    center:
      parseFloat(gridStyle.left) +
      endpoint.offsetLeft +
      endpoint.offsetWidth / 2
  }
}
