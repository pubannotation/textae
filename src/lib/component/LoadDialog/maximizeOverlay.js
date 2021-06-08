export default function (overlayDropzone) {
  overlayDropzone.element.classList.add(
    'textae-editor__load-dialog__overlay-dropzone--maximized'
  )
  const zIndexOfOverlayDropzone = overlayDropzone.element.style.zIndex
  overlayDropzone.element.style.zIndex = zIndexOfOverlayDropzone + 1
  return zIndexOfOverlayDropzone
}
